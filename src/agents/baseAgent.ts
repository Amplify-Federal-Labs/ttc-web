import { type AxiosInstance } from "axios";
import type { Message } from "../types";
import { v4 } from "uuid";
import { auth } from "../firebase/firebaseConfig";

interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenAIResponse {
    choices: Array<{
        message: {
            content: string | null;
        };
    }>;
}

class BaseAgent {
    private axiosClient: AxiosInstance;
    messages: Message[];

    constructor(axiosClient: AxiosInstance, systemPrompt: string, initialPrompt?: string) {
        this.axiosClient = axiosClient;
        this.messages = [
            {
                id: v4(),
                role: 'system',
                content: systemPrompt
            }
        ];

        if (initialPrompt) {
            this.messages = [
                ...this.messages,
                {
                    id: v4(),
                    role: 'assistant',
                    content: initialPrompt
                }
            ];
        }
    }

    getMessages(): Message[] {
        return this.messages.slice(1);
    }

    async sendMessage(content: string): Promise<void> {
        const idToken = await auth.currentUser?.getIdToken();

        try {
            this.messages = [...this.messages, { id: v4(), role: 'user', content }];

            const openAIMessages: OpenAIMessage[] = this.messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const body = {
                model: 'gpt-4o',
                messages: openAIMessages
            };
            const config = {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            };
            const response = await this.axiosClient.post<OpenAIResponse>(
                '/v1/chat/completions', body, config
            );

            const completion = response.data;

            this.messages = [
                ...this.messages,
                {
                    id: v4(),
                    role: 'assistant',
                    content: completion.choices[0].message.content || ''
                }
            ];

        } catch (error) {
            this.messages = [
                ...this.messages,
                {
                    id: v4(),
                    role: 'assistant',
                    content: `Error: ${error}`
                }
            ];
        }
    }
}

export default BaseAgent;