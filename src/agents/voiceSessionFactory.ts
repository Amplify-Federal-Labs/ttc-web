import { CONCIERGE_AGENT_PROMPT, INTERVIEW_AGENT_PROMPT } from "../prompts/systemPrompts";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import { RealtimeAgent, RealtimeSession, type RealtimeItem } from "@openai/agents/realtime";

export const createConciergeAgent = (): RealtimeAgent => {
    return new RealtimeAgent({
        name: 'Concierge Agent',
        instructions: `${RECOMMENDED_PROMPT_PREFIX}\n${CONCIERGE_AGENT_PROMPT}`,
        handoffDescription: 'Expert at providing personalized gift recommendations with thoughtful notes based on recipient profiles',
    });
};

export const createInterviewAgent = (conciergeAgent: RealtimeAgent): RealtimeAgent => {
    return new RealtimeAgent({
        name: 'Interview Agent',
        instructions: INTERVIEW_AGENT_PROMPT,
        handoffs: [conciergeAgent],
    });
};

export const createRealtimeSession = (interviewAgent: RealtimeAgent): RealtimeSession => {
    return new RealtimeSession(interviewAgent, {
        model: 'gpt-4o-realtime-preview-2025-06-03',
        config: {
            inputAudioFormat: 'pcm16',
            outputAudioFormat: 'pcm16',
            inputAudioTranscription: {
                model: 'gpt-4o-mini-transcribe',
            },
        },
    });
};

export const connectAndSetupSession = async (
    session: RealtimeSession,
    apiKey: string,
    handleHistoryUpdated: (history: RealtimeItem[]) => void
): Promise<void> => {
    await session.connect({ apiKey });
    console.log('Session connected successfully');
    
    session.on('history_updated', handleHistoryUpdated);
    
    // Trigger automatic voice greeting from the agent
    try {
        await session.transport.sendEvent({
            type: "response.create"
        });
    } catch (error) {
        console.error('Failed to trigger automatic greeting:', error);
    }
};