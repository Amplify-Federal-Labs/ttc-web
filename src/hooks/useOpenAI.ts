import OpenAI from 'openai';
import { useState } from 'react';
import type { Message } from '../types';
import { INTERVIEW_AGENT_PROMPT } from '../prompts/systemPrompts';

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_APIKEY, // This is the default and can be omitted
    dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT: Message = {
    role: 'system',
    content: INTERVIEW_AGENT_PROMPT
}

const useOpenAIChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (prompt: string) => {
        setLoading(true);

        try {
            // Make API call to OpenAI
            const completion = await client.chat.completions.create({
                model: 'gpt-4o',
                messages: [SYSTEM_PROMPT, ...messages, { role: 'user', content: prompt }],
            });

            // Process response and update messages state
            // completion.choices[0].message.content
            setMessages([...messages, 
                { 
                    role: 'user', content: prompt }
                , 
                {
                    role: 'assistant',
                    content: completion.choices[0].message.content || ''
                }]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return { messages, loading, sendMessage };
};

export default useOpenAIChat;
