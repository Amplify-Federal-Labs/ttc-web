import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import useVoiceAgent, { resetVoiceAgentState } from '../useVoiceAgent';
import authenticatedOpenAIService from '../../services/authenticatedAxiosClient';

// Mock the dependencies
vi.mock('../../services/authenticatedAxiosClient');
vi.mock('@openai/agents/realtime', () => ({
  RealtimeAgent: vi.fn(),
  RealtimeSession: vi.fn(() => ({
    connect: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    off: vi.fn(),
    close: vi.fn()
  }))
}));

const mockAuthenticatedOpenAIService = vi.mocked(authenticatedOpenAIService);

describe('useVoiceAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetVoiceAgentState();
    
    // Mock the axios client
    mockAuthenticatedOpenAIService.getClient.mockReturnValue({
      post: vi.fn().mockResolvedValue({
        data: {
          client_secret: {
            value: 'mock-api-key'
          }
        }
      })
    } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
    resetVoiceAgentState();
  });

  it('should not create multiple sessions when React.StrictMode double-mounts component', async () => {
    // First render (simulating first mount in StrictMode)
    const { unmount: unmount1 } = renderHook(() => useVoiceAgent());
    
    // Immediately unmount (simulating StrictMode cleanup)
    act(() => {
      unmount1();
    });
    
    // Second render (simulating second mount in StrictMode)
    const { unmount: unmount2 } = renderHook(() => useVoiceAgent());
    
    // Wait a bit for any async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Verify that the axios client post method (which creates sessions) was called only once
    expect(mockAuthenticatedOpenAIService.getClient).toHaveBeenCalledTimes(1);
    
    // Clean up
    act(() => {
      unmount2();
    });
  });

  it('should initialize with loading state and empty messages', () => {
    const { result } = renderHook(() => useVoiceAgent());
    
    // Since we start session creation immediately, loading should be true initially
    expect(result.current.loading).toBe(true);
    expect(result.current.messages).toEqual([]);
    expect(result.current.session).toBe(null);
  });

  it('should handle session creation errors gracefully', async () => {
    // Mock a failed API call
    mockAuthenticatedOpenAIService.getClient.mockReturnValue({
      post: vi.fn().mockRejectedValue(new Error('API request failed'))
    } as never);
    
    const { result } = renderHook(() => useVoiceAgent());
    
    // Wait for error handling
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(result.current.loading).toBe(false);
    expect(result.current.session).toBe(null);
  });
});