import axios, { type AxiosInstance } from "axios";
import { onAuthStateChanged } from '../firebase/auth';
import type { User } from 'firebase/auth';

class AuthenticatedAxiosClient {
  private static instance: AuthenticatedAxiosClient;
  private client: AxiosInstance | null = null;
  private unsubscribeAuth: (() => void) | null = null;

  private constructor() {
    this.initializeAuthListener();
  }

  static getInstance(): AuthenticatedAxiosClient {
    if (!AuthenticatedAxiosClient.instance) {
      AuthenticatedAxiosClient.instance = new AuthenticatedAxiosClient();
    }
    return AuthenticatedAxiosClient.instance;
  }

  private initializeAuthListener(): void {
    this.unsubscribeAuth = onAuthStateChanged(async (user: User | null) => {
      if (user) {
        await this.createAuthenticatedInstance(user);
      } else {
        this.clearInstance();
      }
    });
  }

  private async createAuthenticatedInstance(user: User): Promise<void> {
    try {
      const idToken = await user.getIdToken();
      this.client = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
        headers: {
            Authorization: `Bearer ${idToken}`
        }
      });
    } catch (error) {
      console.error('Failed to create authenticated OpenAI client:', error);
      this.client = null;
    }
  }

  private clearInstance(): void {
    this.client = null;
  }

  getClient(): AxiosInstance | null {
    return this.client;
  }

  isAuthenticated(): boolean {
    return this.client !== null;
  }

  async refreshClient(): Promise<void> {
    // Force refresh the current user's token
    const { auth } = await import('../firebase/firebaseConfig');
    if (auth.currentUser) {
      await this.createAuthenticatedInstance(auth.currentUser);
    }
  }

  destroy(): void {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
    this.clearInstance();
  }
}

// Export singleton instance
export const authenticatedOpenAIService = AuthenticatedAxiosClient.getInstance();
export default authenticatedOpenAIService;