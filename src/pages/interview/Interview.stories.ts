import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { Message } from '../../types';
import Interview from './interview';
import { v4 } from 'uuid';

const meta = {
  title: 'Pages/Interview/Interview',
  component: Interview,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    messages: {
      control: 'object',
      description: 'Array of messages in the conversation history',
    },
    onUserPropmt: {
      action: 'user-prompt-submitted',
      description: 'Callback function when user submits a prompt',
    },
  },
  args: {
    onUserPropmt: fn(),
  },
} satisfies Meta<typeof Interview>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages: Message[] = [
  {
    id: v4(),
    role: 'assistant',
    content: 'Hi! I\'m here to help you find the perfect gift. Let\'s start by talking about who you\'re shopping for.',
  },
  {
    id: v4(),
    role: 'user',
    content: 'I\'m looking for a gift for my sister.',
  },
  {
    id: v4(),
    role: 'assistant',
    content: 'That\'s wonderful! Tell me a bit about your sister. What are some of her interests or hobbies?',
  },
];

export const Default: Story = {
  args: {
    messages: sampleMessages,
  },
};

export const EmptyConversation: Story = {
  args: {
    messages: [],
  },
};

export const StartingConversation: Story = {
  args: {
    messages: [
      {
        id: v4(),
        role: 'assistant',
        content: 'Welcome! I\'m your personal gift concierge. What\'s the occasion you\'re shopping for?',
      },
    ],
  },
};

export const LongConversation: Story = {
  args: {
    messages: [
      {
        id: v4(),
        role: 'assistant',
        content: 'Hi! I\'m here to help you find the perfect gift. Let\'s start by talking about who you\'re shopping for.',
      },
      {
        id: v4(),
        role: 'user',
        content: 'I\'m looking for a gift for my brother who just graduated from college.',
      },
      {
        id: v4(),
        role: 'assistant',
        content: 'Congratulations to your brother! That\'s such an exciting milestone. What did he study?',
      },
      {
        id: v4(),
        role: 'user',
        content: 'He studied computer science and he\'s starting his first job at a tech company next month.',
      },
      {
        id: v4(),
        role: 'assistant',
        content: 'That\'s fantastic! A CS graduate starting in tech - there are so many great gift possibilities. What are his interests outside of work? Does he have any hobbies?',
      },
      {
        id: v4(),
        role: 'user',
        content: 'He loves gaming, especially PC gaming, and he\'s really into mechanical keyboards and tech gadgets.',
      },
      {
        id: v4(),
        role: 'assistant',
        content: 'Perfect! A tech-savvy gamer who appreciates quality peripherals. What\'s your budget range for this graduation gift?',
      },
    ],
  },
};