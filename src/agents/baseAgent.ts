import OpenAI from "openai";
import type { Message } from "../types";
import { v4 } from "uuid";

class BaseAgent {
    client: OpenAI;
    messages: Message[];

    constructor(client: OpenAI, systemPrompt: string, initialPrompt?: string) {
        this.client = client;
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
        try {
            this.messages = [...this.messages, { id: v4(), role: 'user', content }];

            // Make API call to OpenAI
            const completion = await this.client.chat.completions.create({
                model: 'gpt-4o',
                messages: [...this.messages]
            });

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