import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the modules first
vi.mock('@openai/agents');
vi.mock('openai');
vi.mock('../../firebase/firebaseConfig', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mock-jwt-token')
    }
  }
}));
vi.mock('../../firebase/auth', () => ({
  onAuthStateChanged: vi.fn().mockImplementation((callback) => {
    // Immediately call with a mock user
    callback({ getIdToken: vi.fn().mockResolvedValue('mock-jwt-token') });
    // Return unsubscribe function
    return vi.fn();
  })
}));
vi.mock('../../services/authenticatedOpenAIService', () => ({
  authenticatedOpenAIService: {
    isAuthenticated: vi.fn().mockReturnValue(true),
    getClient: vi.fn().mockReturnValue({}),
    getInstance: vi.fn()
  }
}));

// Now import the actual implementations
import { AgentOrchestrator } from '../agentOrchestrator';
import { run } from '@openai/agents';
import { authenticatedOpenAIService } from '../../services/authenticatedOpenAIService';

const mockRun = vi.mocked(run);
const mockAuthService = vi.mocked(authenticatedOpenAIService);

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset environment variable
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:3001');
    
    // Reset mock auth service
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.getClient.mockReturnValue({} as OpenAI);
    
    orchestrator = new AgentOrchestrator();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with empty conversation history', () => {
      expect(orchestrator.getConversationHistory()).toEqual([]);
    });

    it('should initialize with Interview Agent as current agent', () => {
      expect(orchestrator.getCurrentAgent()).toBe('Interview Agent');
    });
  });

  describe('sendMessage', () => {
    it('should send a message and return response without handoff', async () => {
      // Setup
      const userMessage = 'Hello, I need help finding a gift';
      const mockResponse = 'Hi! I\'d be happy to help you find the perfect gift. Could you tell me about the person you\'re shopping for?';
      
      mockRun.mockResolvedValue({
        finalOutput: mockResponse,
        trace: { events: [] }
      });

      // Execute
      const result = await orchestrator.sendMessage(userMessage);

      // Verify
      expect(result.response).toBe(mockResponse);
      expect(result.agent).toBe('Interview Agent');
      expect(result.handoffOccurred).toBe(false);
      expect(result.conversationHistory).toHaveLength(2);
      expect(result.conversationHistory[0]).toEqual({
        role: 'user',
        content: userMessage,
        agent: 'Interview Agent'
      });
      expect(result.conversationHistory[1]).toEqual({
        role: 'assistant',
        content: mockResponse,
        agent: 'Interview Agent'
      });

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockRun).toHaveBeenCalledTimes(1);
    });

    it('should handle handoff when detected', async () => {
      // Setup
      const userMessage = 'I think I\'ve told you enough about my friend';
      const mockResponse = 'Perfect! Based on your friend\'s love for cooking and your close relationship, here are some thoughtful gift recommendations...';
      
      mockRun.mockResolvedValue({
        finalOutput: mockResponse,
        trace: { 
          events: [
            { type: 'tool_call', name: 'transfer_to_concierge_agent' }
          ] 
        }
      });

      // Execute
      const result = await orchestrator.sendMessage(userMessage);

      // Verify
      expect(result.handoffOccurred).toBe(true);
      expect(result.agent).toBe('Concierge Agent');
      expect(orchestrator.getCurrentAgent()).toBe('Concierge Agent');
    });

    it('should use authenticated OpenAI service', async () => {
      // Setup
      const userMessage = 'Test message';
      mockRun.mockResolvedValue({
        finalOutput: 'Test response',
        trace: { events: [] }
      });

      // Execute
      await orchestrator.sendMessage(userMessage);

      // Verify auth service was checked
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });

    it('should handle unauthenticated state gracefully', async () => {
      // Setup
      mockAuthService.isAuthenticated.mockReturnValue(false);
      const userMessage = 'Test message';

      // Execute
      const result = await orchestrator.sendMessage(userMessage);

      // Verify error handling for unauthenticated state
      expect(result.response).toBe('I apologize, but I encountered an error. Please try again.');
      expect(result.handoffOccurred).toBe(false);
      expect(mockRun).not.toHaveBeenCalled();
    });

    it('should build conversation items correctly for multiple messages', async () => {
      // Setup - send first message
      mockRun.mockResolvedValue({
        finalOutput: 'First response',
        trace: { events: [] }
      });
      
      await orchestrator.sendMessage('First message');
      
      // Setup - send second message
      mockRun.mockResolvedValue({
        finalOutput: 'Second response',
        trace: { events: [] }
      });

      // Execute
      await orchestrator.sendMessage('Second message');

      // Verify the conversation items were built correctly
      const runCalls = mockRun.mock.calls;
      expect(runCalls).toHaveLength(2);

      // Check the second call includes conversation history
      const secondCallArgs = runCalls[1];
      const conversationItems = secondCallArgs[1];
      
      expect(conversationItems).toEqual([
        {
          type: 'message',
          role: 'user',
          content: 'First message'
        },
        {
          type: 'message',
          role: 'assistant',
          status: 'completed',
          content: [{
            type: 'output_text',
            text: 'First response'
          }]
        },
        {
          type: 'message',
          role: 'user',
          content: 'Second message'
        }
      ]);
    });

    it('should handle errors gracefully', async () => {
      // Setup
      const error = new Error('Network error');
      mockRun.mockRejectedValue(error);
      
      // Mock console.error to avoid noise in test output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Execute
      const result = await orchestrator.sendMessage('Test message');

      // Verify
      expect(result.response).toBe('I apologize, but I encountered an error. Please try again.');
      expect(result.agent).toBe('Interview Agent');
      expect(result.handoffOccurred).toBe(false);
      expect(result.conversationHistory).toHaveLength(2);
      expect(result.conversationHistory[0]).toEqual({
        role: 'user',
        content: 'Test message',
        agent: 'Interview Agent'
      });
      expect(result.conversationHistory[1]).toEqual({
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        agent: 'Interview Agent'
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error in agent orchestrator:', error);
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should filter out system messages from conversation items', async () => {
      // Setup - manually add a system message to test filtering
      orchestrator['conversationHistory'] = [
        {
          role: 'system',
          content: 'System message',
          agent: 'Interview Agent'
        },
        {
          role: 'user',
          content: 'User message',
          agent: 'Interview Agent'
        }
      ];

      mockRun.mockResolvedValue({
        finalOutput: 'Response',
        trace: { events: [] }
      });

      // Execute
      await orchestrator.sendMessage('New message');

      // Verify system messages are filtered out
      const runCalls = mockRun.mock.calls;
      const conversationItems = runCalls[0][1];
      
      expect(conversationItems).toEqual([
        {
          type: 'message',
          role: 'user',
          content: 'User message'
        },
        {
          type: 'message',
          role: 'user',
          content: 'New message'
        }
      ]);
    });
  });

  describe('detectHandoffFromResult', () => {
    it('should detect handoff from tool_call event', () => {
      const result = {
        trace: {
          events: [
            { type: 'tool_call', name: 'transfer_to_concierge_agent' }
          ]
        }
      };

      const isHandoff = orchestrator['detectHandoffFromResult'](result);
      expect(isHandoff).toBe(true);
    });

    it('should detect handoff from handoff event', () => {
      const result = {
        trace: {
          events: [
            { type: 'handoff' }
          ]
        }
      };

      const isHandoff = orchestrator['detectHandoffFromResult'](result);
      expect(isHandoff).toBe(true);
    });

    it('should not detect handoff when no relevant events', () => {
      const result = {
        trace: {
          events: [
            { type: 'llm_call' },
            { type: 'tool_call', name: 'get_weather' }
          ]
        }
      };

      const isHandoff = orchestrator['detectHandoffFromResult'](result);
      expect(isHandoff).toBe(false);
    });

    it('should handle missing trace gracefully', () => {
      const result = {};
      const isHandoff = orchestrator['detectHandoffFromResult'](result);
      expect(isHandoff).toBe(false);
    });

    it('should handle missing events gracefully', () => {
      const result = { trace: {} };
      const isHandoff = orchestrator['detectHandoffFromResult'](result);
      expect(isHandoff).toBe(false);
    });
  });

  describe('getConversationHistory', () => {
    it('should return a copy of conversation history', () => {
      // Setup
      const history = [
        { role: 'user' as const, content: 'Test', agent: 'Interview Agent' }
      ];
      orchestrator['conversationHistory'] = history;

      // Execute
      const result = orchestrator.getConversationHistory();

      // Verify
      expect(result).toEqual(history);
      expect(result).not.toBe(history); // Should be a copy, not reference
    });
  });

  describe('getCurrentAgent', () => {
    it('should return current agent name', () => {
      expect(orchestrator.getCurrentAgent()).toBe('Interview Agent');
      
      // Change agent
      orchestrator['currentAgentName'] = 'Concierge Agent';
      expect(orchestrator.getCurrentAgent()).toBe('Concierge Agent');
    });
  });

  describe('reset', () => {
    it('should reset conversation history and current agent', () => {
      // Setup - add some history
      orchestrator['conversationHistory'] = [
        { role: 'user', content: 'Test', agent: 'Interview Agent' }
      ];
      orchestrator['currentAgentName'] = 'Concierge Agent';

      // Execute
      orchestrator.reset();

      // Verify
      expect(orchestrator.getConversationHistory()).toEqual([]);
      expect(orchestrator.getCurrentAgent()).toBe('Interview Agent');
    });
  });

  describe('conversation flow integration', () => {
    it('should maintain conversation context across multiple messages', async () => {
      // Setup responses
      mockRun
        .mockResolvedValueOnce({
          finalOutput: 'First response',
          trace: { events: [] }
        })
        .mockResolvedValueOnce({
          finalOutput: 'Second response',
          trace: { events: [] }
        })
        .mockResolvedValueOnce({
          finalOutput: 'Third response with handoff',
          trace: { events: [{ type: 'tool_call', name: 'transfer_to_concierge_agent' }] }
        });

      // Execute conversation
      const result1 = await orchestrator.sendMessage('First message');
      const result2 = await orchestrator.sendMessage('Second message');
      const result3 = await orchestrator.sendMessage('Third message');

      // Verify conversation state
      expect(result1.handoffOccurred).toBe(false);
      expect(result2.handoffOccurred).toBe(false);
      expect(result3.handoffOccurred).toBe(true);

      expect(result3.agent).toBe('Concierge Agent');
      expect(orchestrator.getCurrentAgent()).toBe('Concierge Agent');

      // Verify final conversation history
      expect(result3.conversationHistory).toHaveLength(6); // 3 user + 3 assistant messages
      expect(result3.conversationHistory[0]).toEqual({
        role: 'user',
        content: 'First message',
        agent: 'Interview Agent'
      });
      expect(result3.conversationHistory[5]).toEqual({
        role: 'assistant',
        content: 'Third response with handoff',
        agent: 'Concierge Agent'
      });
    });
  });
});