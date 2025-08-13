type Role = 'system' | 'user' | 'assistant';

interface Message {
    role: Role,
    content: string,
}

export type { Role, Message }