# ADR-002: OpenAI Agents SDK with Custom Backend Proxy

## Status
Proposed

## Date
2025-08-05

## Context

Our gift recommendation application currently uses custom agent implementations with direct OpenAI API calls from the React frontend. While functional, this approach has several limitations:

1. **Security Risk**: OpenAI API keys are exposed in client-side code, violating security best practices
2. **Limited Functionality**: Custom agent implementation lacks advanced features like handoffs, guardrails, and structured outputs
3. **Maintenance Overhead**: Custom orchestration logic requires ongoing maintenance as OpenAI evolves
4. **Missing Modern Features**: Cannot leverage OpenAI's new Responses API and built-in tools

We want to upgrade to OpenAI's official `@openai/agents` npm package to benefit from:
- Proper agent handoffs between Interview Agent and Concierge Agent
- Built-in guardrails for safer AI interactions
- Structured outputs and better error handling
- Future compatibility with OpenAI's roadmap

However, using the Agents SDK directly in the frontend would require exposing our OpenAI API key, which OpenAI explicitly recommends against.

## Decision

We will implement a **Backend API Proxy Architecture** that allows us to use the `@openai/agents` SDK in our React frontend while keeping API keys secure on the backend.

### Architecture Overview

```
React Frontend (@openai/agents) → Custom Backend API → OpenAI API
                                      ↑
                                 Secure API Key
```

### Core Components

1. **Frontend (React + @openai/agents)**
   - Use official OpenAI Agents SDK for full functionality
   - Configure custom baseURL pointing to our backend
   - Maintain existing Firebase authentication flow

2. **Backend API Server (Node.js/Express)**
   - Implement OpenAI-compatible REST endpoints
   - Proxy requests to real OpenAI API with secure credentials
   - Add Firebase auth validation middleware

### Key Implementation Details

#### Frontend Configuration
```typescript
import { OpenAI } from 'openai';
import { Agent, run } from '@openai/agents';

const customClient = new OpenAI({
  baseURL: 'https://our-backend.com',
  apiKey: 'frontend-placeholder-key' // Not used, but required by SDK
});

const interviewAgent = new Agent({
  client: customClient,
  name: 'Interview Agent',
  instructions: 'Conduct thoughtful interviews about gift recipients...'
});
```

#### Backend Endpoints
- `POST /v1/responses` - Primary endpoint for Agents SDK (Responses API)
- `POST /v1/chat/completions` - Fallback support for Chat Completions API
- Request/response format must match OpenAI specification exactly

#### Authentication Flow
1. Frontend sends Firebase auth token in request headers
2. Backend validates token before proxying to OpenAI
3. Backend makes authenticated requests to OpenAI with secure API key
4. Response proxied back to frontend

### Migration Strategy

1. **Phase 1**: Create backend proxy server with OpenAI-compatible endpoints
2. **Phase 2**: Install `@openai/agents` and `zod@3.25.67` in frontend
3. **Phase 3**: Replace custom BaseAgent with proper Agents SDK implementation
4. **Phase 4**: Implement Interview Agent → Concierge Agent handoffs using SDK

## Alternatives Considered

### 1. Keep Custom Agent Implementation
**Pros**: No additional backend infrastructure, simpler deployment
**Cons**: Missing advanced features, security risks, maintenance overhead

### 2. Move All Agent Logic to Backend
**Pros**: Maximum security, simpler frontend
**Cons**: Loss of frontend agent orchestration, complex state synchronization

### 3. Use Third-Party Proxy Services
**Pros**: No backend development required
**Cons**: Additional vendor dependency, potential security/privacy concerns

## Consequences

### Positive
- **Security**: API keys remain completely secure on backend
- **Feature Access**: Full access to OpenAI Agents SDK capabilities
- **Future-Proof**: Compatible with OpenAI's latest Responses API and roadmap
- **Proper Handoffs**: Native support for Interview → Concierge agent transitions
- **Better Error Handling**: Built-in guardrails and error management
- **Cost Control**: Backend can implement rate limiting and usage monitoring

### Negative
- **Infrastructure Complexity**: Additional backend service to deploy and maintain
- **Latency**: Extra network hop through proxy may increase response times
- **Development Overhead**: Need to maintain OpenAI API compatibility in proxy

### Risks
- **API Compatibility**: Backend proxy must perfectly match OpenAI REST specification
- **Deployment Complexity**: Additional service to deploy and monitor
- **Version Synchronization**: Keeping proxy compatible as OpenAI evolves APIs

## Implementation Requirements

### Backend API Specifications

The backend must implement these endpoints exactly matching OpenAI's specification:

#### POST /v1/responses
- Accept same request format as OpenAI Responses API
- Add Firebase auth validation
- Proxy to `https://api.openai.com/v1/responses`
- Return response in identical format

#### POST /v1/chat/completions
- Accept same request format as OpenAI Chat Completions API
- Add Firebase auth validation  
- Proxy to `https://api.openai.com/v1/chat/completions`
- Return response in identical format

### Security Requirements
- All requests must include valid Firebase authentication token
- OpenAI API key stored securely in backend environment variables
- Request logging for monitoring and debugging
- Rate limiting to prevent abuse

### Error Handling
- Proxy OpenAI errors transparently to frontend
- Add custom error codes for authentication failures
- Graceful handling of network timeouts and retries

## Future Considerations

1. **Multi-Model Support**: Backend could route to different LLM providers based on request
2. **Caching Layer**: Add response caching to reduce costs and improve performance
3. **Analytics**: Implement detailed usage tracking and cost monitoring
4. **Scaling**: Consider serverless deployment for better cost efficiency

## Technical Dependencies

- **Frontend**: `@openai/agents`, `zod@3.25.67` 
- **Backend**: Express.js, Firebase Admin SDK, OpenAI Node.js SDK
- **Infrastructure**: Backend hosting (Vercel Functions, AWS Lambda, or traditional server)