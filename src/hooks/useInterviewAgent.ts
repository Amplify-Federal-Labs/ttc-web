import { useEffect, useState } from 'react';
import type { Message } from '../types';
import { interviewAgent } from '../agents';

const useInterviewAgent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMessages(interviewAgent.getMessages());
    });

    const sendMessage = async (content: string) => {
        setLoading(true);

        try {
            await interviewAgent.sendMessage(content);

            setMessages(interviewAgent.getMessages());
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return { messages, loading, sendMessage };
};

export default useInterviewAgent;
