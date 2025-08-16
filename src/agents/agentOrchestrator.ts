import { Agent, handoff, run, RunContext, type AgentInputItem } from '@openai/agents';
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions';
import { z } from 'zod';
import { INTERVIEW_AGENT_PROMPT, CONCIERGE_AGENT_PROMPT } from '../prompts/systemPrompts';
import type { Role } from '../types';
import { authenticatedOpenAIService } from '../services/authenticatedOpenAIService';

const ProfileData = z.object({ text: z.string() });
type ProfileData = z.infer<typeof ProfileData>;

async function onHandoff(
  _ctx: RunContext<ProfileData>,
  input: ProfileData | undefined,
) {
  // TODO: Save the recipient profile in Firestore for future reference
  console.log(`Concierge agent called with input: ${input?.text}`);
}

// Helper function to create agents
const createAgents = () => {
  const conciergeAgent = new Agent({
    name: 'Concierge Agent',
    instructions: `${RECOMMENDED_PROMPT_PREFIX}
  ${CONCIERGE_AGENT_PROMPT}`,
    handoffDescription: 'Expert at providing personalized gift recommendations with thoughtful notes based on recipient profiles',
    model: 'gpt-4o'
  });

  const conciergeHandoff = handoff(conciergeAgent, {
    onHandoff,
    inputType: ProfileData
  });

  const interviewAgent = Agent.create({
    name: 'Interview Agent',
    instructions: INTERVIEW_AGENT_PROMPT,
    handoffs: [conciergeHandoff],
    model: 'gpt-4o'
  });

  return { interviewAgent, conciergeAgent };
};

// Agent orchestrator that manages the conversation flow
export class AgentOrchestrator {
  private conversationHistory: Array<{ role: Role; content: string; agent: string }>;
  private currentAgentName: string;

  constructor() {
    this.conversationHistory = [];
    this.currentAgentName = 'Interview Agent';
  }

  async sendMessage(userMessage: string): Promise<{
    response: string;
    agent: string;
    handoffOccurred: boolean;
    conversationHistory: Array<{ role: Role; content: string; agent: string }>;
  }> {
    // Add user message to history first
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      agent: this.currentAgentName
    });

    let handoffOccurred = false;

    try {
      // Check if we have an authenticated client
      if (!authenticatedOpenAIService.isAuthenticated()) {
        throw new Error('No authenticated user. Please log in to continue.');
      }

      // Create agents (client is already set as default by the service)
      const { interviewAgent } = createAgents();

      // Build the conversation context using proper AgentInputItem array format
      // The current user message is already included in conversationHistory
      const conversationItems: AgentInputItem[] = this.conversationHistory
        .filter(msg => msg.role !== 'system') // Exclude system messages as they're in agent instructions
        .map(msg => {
          if (msg.role === 'user') {
            return {
              type: 'message',
              role: 'user',
              content: msg.content
            };
          } else {
            return {
              type: 'message',
              role: 'assistant',
              status: 'completed' as const,
              content: [{
                type: 'output_text',
                text: msg.content
              }]
            };
          }
        });

      // Always start with the interview agent for the orchestrated flow
      // The SDK will handle handoffs automatically using the authenticated client
      const result = await run(interviewAgent, conversationItems);
      const responseContent = result.finalOutput || '';

      // Use SDK's native handoff detection
      // Check if a handoff occurred by examining the result structure
      if (this.detectHandoffFromResult(result) && this.currentAgentName === 'Interview Agent') {
        handoffOccurred = true;
        this.currentAgentName = 'Concierge Agent';
      }

      // Add agent response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: responseContent,
        agent: this.currentAgentName
      });

      return {
        response: responseContent,
        agent: this.currentAgentName,
        handoffOccurred,
        conversationHistory: [...this.conversationHistory]
      };

    } catch (error) {
      console.error('Error in agent orchestrator:', error);

      const errorMessage = 'I apologize, but I encountered an error. Please try again.';
      this.conversationHistory.push({
        role: 'assistant',
        content: errorMessage,
        agent: this.currentAgentName
      });

      return {
        response: errorMessage,
        agent: this.currentAgentName,
        handoffOccurred: false,
        conversationHistory: [...this.conversationHistory]
      };
    }
  }

  // Helper to detect handoffs through SDK trace analysis
  private detectHandoffFromResult(result: unknown): boolean {
    // Check if the result contains handoff information
    // This might be in result.trace, result.events, or similar SDK properties
    const resultObj = result as { trace?: { events?: Array<{ type?: string; name?: string }> } };
    if (resultObj.trace?.events) {
      return resultObj.trace.events.some((event) =>
        event.type === 'handoff' || (event.type === 'tool_call' && event.name?.includes('transfer_to'))
      );
    }
    return false;
  }

  // Get current conversation history
  getConversationHistory() {
    return [...this.conversationHistory];
  }

  // Get current agent name
  getCurrentAgent(): string {
    return this.currentAgentName;
  }

  // Reset the flow
  reset(): void {
    this.conversationHistory = [];
    this.currentAgentName = 'Interview Agent';
  }
}