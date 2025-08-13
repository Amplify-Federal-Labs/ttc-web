import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Message } from '../../types';
import InterviewHistory from './interviewHistory';

const meta = {
  title: 'Pages/Interview/InterviewHistory',
  component: InterviewHistory,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    messages: {
      control: 'object',
      description: 'Array of messages to display in the interview history',
    },
  },
} satisfies Meta<typeof InterviewHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages: Message[] = [
  {
    role: 'assistant',
    content: 'Hi! I\'m here to help you find the perfect gift. Let\'s start by talking about who you\'re shopping for.',
  },
  {
    role: 'user',
    content: 'I\'m looking for a gift for my sister.',
  },
  {
    role: 'assistant',
    content: 'That\'s wonderful! Tell me a bit about your sister. What are some of her interests or hobbies?',
  },
  {
    role: 'user',
    content: 'She loves reading, especially fantasy novels, and she\'s really into yoga and meditation.',
  },
  {
    role: 'assistant',
    content: 'Great! A bookworm who enjoys wellness activities. What\'s the occasion for this gift?',
  },
];

export const Default: Story = {
  args: {
    messages: sampleMessages,
  },
};

export const Empty: Story = {
  args: {
    messages: [],
  },
};

export const SingleMessage: Story = {
  args: {
    messages: [
      {
        role: 'assistant',
        content: 'Welcome to the gift recommendation interview!',
      },
    ],
  },
};

export const LongConversation: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        role: 'user',
        content: 'It\'s for her birthday next month.',
      },
      {
        role: 'assistant',
        content: 'Perfect! What\'s your budget range for this birthday gift?',
      },
      {
        role: 'user',
        content: 'I\'d like to keep it under $100.',
      },
      {
        role: 'assistant',
        content: 'Excellent! Based on what you\'ve told me, I have some great ideas. Does she have a favorite fantasy author or series?',
      },
      {
        role: 'user',
        content: 'She absolutely loves Brandon Sanderson and The Stormlight Archive series.',
      },
    ],
  },
};