import { useEffect, useState } from 'react';
import type { Message } from '../types';
import { interviewAgent, conciergeAgent } from '../agents';

type AgentType = 'interview' | 'concierge' | 'complete';

interface GiftRecommendationFlowState {
    currentAgent: AgentType;
    profile: string | null;
    allMessages: Message[];
}

const shouldTransitionToConcierge = (messages: Message[]): boolean => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return false;
    
    const content = lastMessage.content.toLowerCase();
    
    // Look for profile summary indicators
    const profileIndicators = [
        '### recipient profile summary',
        '## recipient profile summary',
        'recipient profile summary',
        '### personality & lifestyle',
        '### interests & hobbies',
        'this summary should be clear'
    ];
    
    return profileIndicators.some(indicator => content.includes(indicator));
};

const extractProfile = (messages: Message[]): string => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return '';
    
    return lastMessage.content;
};

const useGiftRecommendationFlow = () => {
    const [state, setState] = useState<GiftRecommendationFlowState>({
        currentAgent: 'interview',
        profile: null,
        allMessages: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initialize with interview agent messages
        setState(prev => ({
            ...prev,
            allMessages: interviewAgent.getMessages()
        }));
    }, []);

    const sendMessage = async (content: string) => {
        setLoading(true);

        try {
            if (state.currentAgent === 'interview') {
                await interviewAgent.sendMessage(content);
                const updatedMessages = interviewAgent.getMessages();
                
                // Check if we should transition to concierge
                if (shouldTransitionToConcierge(updatedMessages)) {
                    const profile = extractProfile(updatedMessages);
                    
                    // Add transition message
                    const transitionMessage: Message = {
                        id: `transition-${Date.now()}`,
                        role: 'assistant',
                        content: 'Perfect! I have all the information I need. Let me find some wonderful gift recommendations for you...'
                    };
                    
                    const messagesWithTransition = [...updatedMessages, transitionMessage];
                    
                    // Start concierge agent with the profile
                    await conciergeAgent.sendMessage(`Based on this recipient profile, please provide personalized gift recommendations:\n\n${profile}`);
                    const conciergeMessages = conciergeAgent.getMessages();
                    
                    setState(prev => ({
                        ...prev,
                        currentAgent: 'concierge',
                        profile,
                        allMessages: [...messagesWithTransition, ...conciergeMessages]
                    }));
                } else {
                    setState(prev => ({
                        ...prev,
                        allMessages: updatedMessages
                    }));
                }
            } else if (state.currentAgent === 'concierge') {
                await conciergeAgent.sendMessage(content);
                const conciergeMessages = conciergeAgent.getMessages();
                
                // Find where concierge messages start in allMessages
                const interviewEndIndex = state.allMessages.findIndex(msg => 
                    msg.content.includes('Let me find some wonderful gift recommendations')
                );
                
                const preTransitionMessages = interviewEndIndex >= 0 
                    ? state.allMessages.slice(0, interviewEndIndex + 1)
                    : state.allMessages;
                
                setState(prev => ({
                    ...prev,
                    allMessages: [...preTransitionMessages, ...conciergeMessages]
                }));
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return { 
        messages: state.allMessages, 
        loading, 
        sendMessage,
        currentAgent: state.currentAgent,
        profile: state.profile
    };
};

export default useGiftRecommendationFlow;