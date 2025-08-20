import { useEffect, useState } from "react";
import type { Message } from "../types"
import { CONCIERGE_AGENT_PROMPT, INTERVIEW_AGENT_PROMPT } from "../prompts/systemPrompts";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import { RealtimeAgent, RealtimeSession, type RealtimeItem, type RealtimeMessageItem } from "@openai/agents/realtime";
import authenticatedOpenAIService from "../services/authenticatedAxiosClient";

const useVoiceAgent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<RealtimeSession | null>();

    const handleHistoryUpdated = (history: RealtimeItem[]) => {
        const messages: Message[] = history
            .filter((item): item is RealtimeMessageItem => {
                return typeof item == 'object';
            })
            .map((item: RealtimeMessageItem) => {
                const textContent = item.content
                    .map(contentItem => {
                        if ('text' in contentItem) {
                            return contentItem.text;
                        }
                        if ('transcript' in contentItem && contentItem.transcript) {
                            return contentItem.transcript;
                        }
                        return '';
                    })
                    .filter(text => text.trim() !== '')
                    .join(' ');

                return {
                    id: item.itemId,
                    role: item.role,
                    content: textContent
                };
            });

        setMessages(messages);
    };

    useEffect(() => {

        console.log("useVoiceAgent::useEffect");

        if (!session) {
            console.log('session not found. Initializing');

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

            const session1 = new RealtimeSession(interviewAgent, {
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
                    session1.connect({ apiKey })
                        .then(() => {
                            console.log('Session connected');
                            setLoading(false);
                            setSession(session1);

                            session1.on('history_updated', handleHistoryUpdated);
                        })
                        .catch(console.error);
                })
                .catch(console.error);
        }

        return () => {
            console.log('umounted. closing session');
            if (session) {
                session.off('history_updated', handleHistoryUpdated);
                session.close();
            }
        }
    }, [session]);

    return {
        loading,
        messages
    }
}

export default useVoiceAgent;