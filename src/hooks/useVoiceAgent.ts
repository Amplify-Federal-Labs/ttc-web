import { useEffect, useState } from "react";
import type { Message } from "../types"
import { CONCIERGE_AGENT_PROMPT, INTERVIEW_AGENT_PROMPT } from "../prompts/systemPrompts";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import { RealtimeAgent, RealtimeSession, type RealtimeItem, type RealtimeMessageItem } from "@openai/agents/realtime";
import authenticatedOpenAIService from "../services/authenticatedAxiosClient";

const useVoiceAgent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        console.log("useVoiceAgent::useEffect");

        const conciergeAgent = new RealtimeAgent({
            name: 'Concierge Agent',
            instructions: `${RECOMMENDED_PROMPT_PREFIX}
          ${CONCIERGE_AGENT_PROMPT}`,
            handoffDescription: 'Expert at providing personalized gift recommendations with thoughtful notes based on recipient profiles',
        });

        const interviewAgent = new RealtimeAgent({
            name: 'Interview Agent',
            instructions: INTERVIEW_AGENT_PROMPT,
            handoffs: [conciergeAgent],
        });

        const session = new RealtimeSession(interviewAgent, {
            model: 'gpt-4o-realtime-preview-2025-06-03',
            config: {
                inputAudioFormat: 'pcm16',
                outputAudioFormat: 'pcm16',
                inputAudioTranscription: {
                    model: 'gpt-4o-mini-transcribe',
                },
            },
        });

        const axioClient = authenticatedOpenAIService.getClient();
        axioClient!.post("/sessions")
            .then((response) => {
                const apiKey = response.data.client_secret.value;
                session.connect({ apiKey })
                    .then(() => {
                        console.log('Session connected');
                        setLoading(false);
                    })
                    .catch(console.error);
            })
            .catch(console.error);

        session.on('history_updated', (history: RealtimeItem[]) => {
            const messages: Message[] = history
                .filter((item): item is RealtimeMessageItem => {
                    return typeof item == 'object';
                })
                .map((item: RealtimeMessageItem) => {
                    return {
                        id: item.itemId,
                        role: item.role,
                        content: '' // TODO
                    };
                });

            setMessages(messages);
        });
    }, []);

    return {
        loading,
        messages
    }
}

export default useVoiceAgent;