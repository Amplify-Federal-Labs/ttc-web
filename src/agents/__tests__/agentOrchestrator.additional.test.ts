/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

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
    callback({ getIdToken: vi.fn().mockResolvedValue('mock-jwt-token') });
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

import { AgentOrchestrator } from '../agentOrchestrator';
import { run } from '@openai/agents';
import { OpenAI } from 'openai';
import { authenticatedOpenAIService } from '../../services/authenticatedOpenAIService';

const mockRun = vi.mocked(run);
const mockAuthService = vi.mocked(authenticatedOpenAIService);

describe('AgentOrchestrator - Additional Coverage', () => {
  let orchestrator: AgentOrchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:3001');
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.getClient.mockReturnValue({} as OpenAI);
    orchestrator = new AgentOrchestrator();
  });

  describe('edge cases', () => {
    it('should handle empty user message', async () => {
      const emptyMessage = '';
      mockRun.mockResolvedValue({
        finalOutput: 'I received an empty message. How can I help you?'
      } as any);

      const result = await orchestrator.sendMessage(emptyMessage);

      expect(result.response).toBe('I received an empty message. How can I help you?');
      expect(result.conversationHistory).toHaveLength(2);
      expect(result.conversationHistory[0].content).toBe('');
    });

    it('should handle very long user message', async () => {
      const longMessage = 'a'.repeat(10000);
      mockRun.mockResolvedValue({
        finalOutput: 'I understand your detailed message.'
      } as any);

      const result = await orchestrator.sendMessage(longMessage);

      expect(result.response).toBe('I understand your detailed message.');
      expect(result.conversationHistory[0].content).toBe(longMessage);
    });

    it('should handle undefined finalOutput from SDK', async () => {
      mockRun.mockResolvedValue({
        finalOutput: undefined
      } as any);

      const result = await orchestrator.sendMessage('Test message');

      expect(result.response).toBe('');
      expect(result.conversationHistory[1].content).toBe('');
    });

    it('should handle null trace in SDK response', async () => {
      const mockResult = { finalOutput: 'Response' } as any;
      mockResult.trace = null;
      
      mockRun.mockResolvedValue(mockResult);

      const result = await orchestrator.sendMessage('Test message');

      expect(result.handoffOccurred).toBe(false);
      expect(result.response).toBe('Response');
    });

    it('should handle authentication service throwing error', async () => {
      mockAuthService.isAuthenticated.mockImplementation(() => {
        throw new Error('Auth service error');
      });

      const result = await orchestrator.sendMessage('Test message');

      expect(result.response).toBe('I apologize, but I encountered an error. Please try again.');
      expect(result.handoffOccurred).toBe(false);
    });
  });

  describe('handoff detection edge cases', () => {
    it('should detect handoff with transfer_to tool name variations', async () => {
      // These are direct tests of the private method, no API call needed
      const result1 = {} as any;
      result1.trace = { events: [{ type: 'tool_call', name: 'transfer_to_gift_concierge' }] };
      
      const result2 = {} as any;
      result2.trace = { events: [{ type: 'tool_call', name: 'transfer_to_concierge_agent' }] };

      expect(orchestrator['detectHandoffFromResult'](result1)).toBe(true);
      expect(orchestrator['detectHandoffFromResult'](result2)).toBe(true);
    });

    it('should not detect handoff for non-transfer tool calls', async () => {
      const result = {} as any;
      result.trace = { 
        events: [
          { type: 'tool_call', name: 'get_weather' },
          { type: 'tool_call', name: 'search_products' },
          { type: 'llm_call' }
        ] 
      };

      expect(orchestrator['detectHandoffFromResult'](result)).toBe(false);
    });

    it('should handle mixed event types correctly', async () => {
      const result = {} as any;
      result.trace = { 
        events: [
          { type: 'llm_call' },
          { type: 'tool_call', name: 'get_weather' },
          { type: 'tool_call', name: 'transfer_to_concierge' },
          { type: 'handoff' }
        ] 
      };

      expect(orchestrator['detectHandoffFromResult'](result)).toBe(true);
    });
  });

  describe('conversation state management', () => {
    it('should reset conversation state completely', () => {
      // Setup some state
      orchestrator['conversationHistory'] = [
        { role: 'user', content: 'Test', agent: 'Interview Agent' },
        { role: 'assistant', content: 'Response', agent: 'Interview Agent' }
      ];
      orchestrator['currentAgentName'] = 'Concierge Agent';

      // Reset
      orchestrator.reset();

      // Verify complete reset
      expect(orchestrator.getConversationHistory()).toEqual([]);
      expect(orchestrator.getCurrentAgent()).toBe('Interview Agent');
    });
  });
});