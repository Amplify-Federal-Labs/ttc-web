import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the modules first - hoisted to top
vi.mock('@openai/agents');
vi.mock('openai');
vi.mock('../../firebase/auth', () => ({
  onAuthStateChanged: vi.fn()
}));

import { authenticatedOpenAIService } from '../authenticatedOpenAIService';

describe('AuthenticatedOpenAIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:3001');
  });

  afterEach(() => {
    // Clean up service state
    authenticatedOpenAIService.destroy();
  });

  describe('service interface', () => {
    it('should provide proper service methods', () => {
      expect(authenticatedOpenAIService.isAuthenticated).toBeDefined();
      expect(authenticatedOpenAIService.getClient).toBeDefined();
      expect(authenticatedOpenAIService.refreshClient).toBeDefined();
      expect(authenticatedOpenAIService.destroy).toBeDefined();
    });

    it('should return null client when not authenticated initially', () => {
      // Clear any existing authentication
      authenticatedOpenAIService.destroy();
      expect(authenticatedOpenAIService.isAuthenticated()).toBe(false);
      expect(authenticatedOpenAIService.getClient()).toBeNull();
    });
  });

  describe('client management', () => {
    it('should have refresh capability', async () => {
      // Call refresh - should not throw even without proper auth setup in tests
      await expect(authenticatedOpenAIService.refreshClient()).resolves.not.toThrow();
    });
  });

  describe('cleanup', () => {
    it('should properly cleanup when destroy is called', () => {
      // Test the cleanup behavior
      authenticatedOpenAIService.destroy();

      // Verify cleanup behavior
      expect(authenticatedOpenAIService.isAuthenticated()).toBe(false);
      expect(authenticatedOpenAIService.getClient()).toBeNull();
    });
  });
});