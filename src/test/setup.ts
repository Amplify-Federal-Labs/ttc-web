import '@testing-library/jest-dom';

// Mock Firebase auth
export const mockAuth = {
  currentUser: {
    getIdToken: vi.fn().mockResolvedValue('mock-jwt-token')
  },
  onAuthStateChanged: vi.fn().mockImplementation((callback) => {
    // Immediately call with a mock user
    callback(mockAuth.currentUser);
    // Return unsubscribe function
    return vi.fn();
  })
};

// Mock Firebase config module - this needs to be before the module is imported
vi.mock('/Users/sangyum/Development/ttc-web-new/src/firebase/firebaseConfig', () => ({
  auth: mockAuth
}));

// Mock Firebase auth functions
vi.mock('/Users/sangyum/Development/ttc-web-new/src/firebase/auth', () => ({
  onAuthStateChanged: mockAuth.onAuthStateChanged
}));

// Mock OpenAI Agents SDK
vi.mock('@openai/agents', () => ({
  Agent: {
    create: vi.fn().mockImplementation((config) => ({
      name: config.name,
      instructions: config.instructions,
      handoffs: config.handoffs,
      model: config.model
    }))
  },
  run: vi.fn(),
  setDefaultOpenAIClient: vi.fn()
}));

// Mock OpenAI SDK
vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation((config) => ({
    baseURL: config.baseURL,
    apiKey: config.apiKey,
    defaultHeaders: config.defaultHeaders,
    dangerouslyAllowBrowser: config.dangerouslyAllowBrowser
  }))
}));

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_BACKEND_URL: 'http://localhost:3001'
  },
  writable: true
});

// Override default environment for tests
vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:3001');