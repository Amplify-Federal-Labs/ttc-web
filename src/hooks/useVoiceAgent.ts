import { useEffect, useState, useCallback } from "react";
import type { Message } from "../types"
import { RealtimeSession, type RealtimeItem, type RealtimeMessageItem } from "@openai/agents/realtime";
import authenticatedOpenAIService from "../services/authenticatedAxiosClient";
import { 
    createConciergeAgent, 
    createInterviewAgent, 
    createRealtimeSession, 
    connectAndSetupSession 
} from "../agents/voiceSessionFactory";

// Module-level session management to handle React.StrictMode double mounting
let globalSession: RealtimeSession | null = null;
let isInitializing = false;
const messageUpdateCallbacks: Set<(messages: Message[]) => void> = new Set();

const useVoiceAgent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const handleHistoryUpdated = useCallback((history: RealtimeItem[]) => {
        const processedMessages: Message[] = history
            .filter((item): item is RealtimeMessageItem => {
                return typeof item == 'object';
            })
            .map((item: RealtimeMessageItem) => {
                const textContent = (item.content || [])
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

        // Update all registered callbacks
        messageUpdateCallbacks.forEach(callback => callback(processedMessages));
    }, []);

    useEffect(() => {
        // Register this component's setMessages callback
        messageUpdateCallbacks.add(setMessages);

        // Initialize session if not already done
        if (!globalSession && !isInitializing) {
            console.log('No global session found and not initializing. Starting session creation...');
            isInitializing = true;
            setLoading(true);

            const conciergeAgent = createConciergeAgent();
            const interviewAgent = createInterviewAgent(conciergeAgent);
            const newSession = createRealtimeSession(interviewAgent);

            const axioClient = authenticatedOpenAIService.getClient();
            axioClient!.post("/sessions")
                .then(async (response) => {
                    const apiKey = response.data.client_secret.value;
                    try {
                        await connectAndSetupSession(newSession, apiKey, handleHistoryUpdated);
                        globalSession = newSession;
                        setLoading(false);
                        isInitializing = false;
                    } catch (error) {
                        console.error('Session connection failed:', error);
                        setLoading(false);
                        isInitializing = false;
                    }
                })
                .catch((error) => {
                    console.error('API key request failed:', error);
                    setLoading(false);
                    isInitializing = false;
                });
        } else if (globalSession) {
            // Session already exists, just set loading to false
            setLoading(false);
        }

        return () => {
            console.log('Component unmounting, removing callback...');
            // Only remove this component's callback, don't close the session
            messageUpdateCallbacks.delete(setMessages);

            // Only close session if no more components are using it
            if (messageUpdateCallbacks.size === 0 && globalSession) {
                console.log('No more components using session, cleaning up...');
                globalSession.off('history_updated', handleHistoryUpdated);
                globalSession.close();
                globalSession = null;
                isInitializing = false;
            }
        }
    }, [handleHistoryUpdated]);

    return {
        loading,
        messages,
        session: globalSession
    }
}

// Export cleanup function for testing
export const resetVoiceAgentState = () => {
    if (globalSession) {
        globalSession.close();
        globalSession = null;
    }
    isInitializing = false;
    messageUpdateCallbacks.clear();
};

export default useVoiceAgent;