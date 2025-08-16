import { OpenAI } from 'openai';
import { setDefaultOpenAIClient } from '@openai/agents';

// Configuration for pointing OpenAI SDK to our backend proxy
// The backend will handle authentication and forward requests to OpenAI
export const createCustomOpenAIClient = (): OpenAI => {
  // In production, this would be your backend API URL
  // For development, this might be localhost:3001 or your dev backend
  const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  
  return new OpenAI({
    baseURL,
    apiKey: 'frontend-placeholder-key', // Not used but required by SDK
    dangerouslyAllowBrowser: true // Required for browser usage
  });
};

export const openaiClient = createCustomOpenAIClient();

// Set the default client for the agents SDK
setDefaultOpenAIClient(openaiClient);