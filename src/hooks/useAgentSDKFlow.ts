import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from '../types';
import { AgentOrchestrator } from '../agents/agentOrchestrator';

type AgentType = 'Interview Agent' | 'Concierge Agent';

interface AgentSDKFlowState {
    currentAgent: AgentType;
    allMessages: Message[];
    agentOrchestrator: AgentOrchestrator;
}

const useAgentSDKFlow = () => {
    const [state, setState] = useState<AgentSDKFlowState>(() => ({
        currentAgent: 'Interview Agent',
        allMessages: [],
        agentOrchestrator: new AgentOrchestrator()
    }));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Add initial greeting from interview agent
        const initialMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: 'Hello! I\'m here to help you find the perfect gift for someone special. To get started, could you tell me about the person you\'re shopping for? What\'s your relationship with them like?'
        };
        
        setState(prev => ({
            ...prev,
            allMessages: [initialMessage]
        }));
    }, []);

    const sendMessage = async (content: string) => {
        setLoading(true);

        try {
            // Add user message to UI immediately
            const userMessage: Message = {
                id: uuidv4(),
                role: 'user',
                content
            };

            setState(prev => ({
                ...prev,
                allMessages: [...prev.allMessages, userMessage]
            }));

            // Send message through agent orchestrator
            const result = await state.agentOrchestrator.sendMessage(content);

            // Convert agent flow response to UI messages
            const assistantMessage: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: result.response
            };

            // If a handoff occurred, we might need to add transition messages
            if (result.handoffOccurred) {
                // Add transition message if handoff occurred
                const transitionMessage: Message = {
                    id: uuidv4(),
                    role: 'assistant',
                    content: 'Perfect! I have all the information I need. Let me connect you with our Gift Concierge who will provide wonderful recommendations...'
                };

                setState(prev => ({
                    ...prev,
                    currentAgent: result.agent as AgentType,
                    allMessages: [...prev.allMessages, transitionMessage, assistantMessage]
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    currentAgent: result.agent as AgentType,
                    allMessages: [...prev.allMessages, assistantMessage]
                }));
            }

        } catch (error) {
            console.error("Error sending message:", error);
            
            // Add error message to UI
            const errorMessage: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again.'
            };

            setState(prev => ({
                ...prev,
                allMessages: [...prev.allMessages, errorMessage]
            }));
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        state.agentOrchestrator.reset();
        setState(prev => ({
            ...prev,
            currentAgent: 'Interview Agent',
            allMessages: []
        }));
    };

    return { 
        messages: state.allMessages, 
        loading, 
        sendMessage,
        currentAgent: state.currentAgent,
        reset
    };
};

export default useAgentSDKFlow;