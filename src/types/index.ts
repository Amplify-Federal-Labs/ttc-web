type Role = 'system' | 'user' | 'assistant';

interface Message {
    id: string;
    role: Role;
    content: string;
}

export type { Role, Message }