import { OpenAI } from 'openai';
import { setDefaultOpenAIClient } from '@openai/agents';
import { onAuthStateChanged } from '../firebase/auth';
import type { User } from 'firebase/auth';

class AuthenticatedOpenAIService {
  private static instance: AuthenticatedOpenAIService;
  private client: OpenAI | null = null;
  private unsubscribeAuth: (() => void) | null = null;

  private constructor() {
    this.initializeAuthListener();
  }

  static getInstance(): AuthenticatedOpenAIService {
    if (!AuthenticatedOpenAIService.instance) {
      AuthenticatedOpenAIService.instance = new AuthenticatedOpenAIService();
    }
    return AuthenticatedOpenAIService.instance;
  }

  private initializeAuthListener(): void {
    this.unsubscribeAuth = onAuthStateChanged(async (user: User | null) => {
      if (user) {
        await this.createAuthenticatedClient(user);
      } else {
        this.clearClient();
      }
    });
  }

  private async createAuthenticatedClient(user: User): Promise<void> {
    try {
      const idToken = await user.getIdToken();
      
      this.client = new OpenAI({
        baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
        apiKey: 'frontend-placeholder-key', // Not used but required by SDK
        defaultHeaders: {
          'Authorization': `Bearer ${idToken}`
        },
        dangerouslyAllowBrowser: true
      });

      // Set as default client for the OpenAI Agents SDK
      setDefaultOpenAIClient(this.client);
    } catch (error) {
      console.error('Failed to create authenticated OpenAI client:', error);
      this.client = null;
    }
  }

  private clearClient(): void {
    this.client = null;
    // Clear the default client in the SDK as well
    try {
      setDefaultOpenAIClient(null as unknown as OpenAI);
    } catch (error) {
      // SDK might not handle null well, but we'll try to clear it
      console.warn('Could not clear default OpenAI client in SDK:', error);
    }
  }

  getClient(): OpenAI | null {
    return this.client;
  }

  isAuthenticated(): boolean {
    return this.client !== null;
  }

  async refreshClient(): Promise<void> {
    // Force refresh the current user's token
    const { auth } = await import('../firebase/firebaseConfig');
    if (auth.currentUser) {
      await this.createAuthenticatedClient(auth.currentUser);
    }
  }

  destroy(): void {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
    this.clearClient();
  }
}

// Export singleton instance
export const authenticatedOpenAIService = AuthenticatedOpenAIService.getInstance();
export default authenticatedOpenAIService;