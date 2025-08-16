## Core Idea:

A gift recommendation application that leverages conversational AI to create personalized gift suggestions with thoughtful accompanying notes. The app conducts an intelligent interview to build a comprehensive recipient profile, then generates curated gift recommendations complete with personalized messages.

## Current Architecture & Features:

### 🤖 **Dual-Agent System**
- **Interview Agent**: Conducts conversational interviews to build comprehensive recipient profiles
- **Concierge Agent**: Generates personalized gift recommendations with accompanying thoughtful notes

### 🎯 **Key Features**
- **Conversational Interface**: Natural chat-based interview experience
- **Seamless Agent Handoff**: Smooth transition from interview to recommendations
- **Markdown Support**: Rich formatting for gift recommendations (headers, lists, bold text)
- **Scrollable Chat**: Bottom-aligned messages that grow upward, full scroll capability
- **Profile Generation**: Structured markdown summaries for LLM-friendly processing
- **Personalized Notes**: Heartfelt messages that accompany each gift suggestion

### 🏗️ **Technical Stack**
- **Frontend**: React + TypeScript + Material-UI
- **State Management**: Custom React hooks with agent orchestration
- **AI Integration**: OpenAI Agents SDK with backend proxy for secure API key management
- **Authentication**: Firebase Auth with Google/GitHub providers
- **Architecture**: Component-based with clean separation of concerns

### 📱 **User Experience Flow**
1. **Interview Phase**: Conversational questions about recipient, occasion, and preferences
2. **Profile Generation**: AI creates structured markdown summary of recipient details
3. **Transition**: Seamless handoff message appears in chat
4. **Recommendations**: Concierge agent provides categorized gift suggestions with:
   - Specific product recommendations
   - Reasoning for each suggestion
   - Personalized note suggestions
   - Price ranges and presentation tips

### 🗂️ **Project Structure**
```
src/
├── agents/
│   ├── agentOrchestrator.ts  # Main agent orchestration with OpenAI Agents SDK
│   ├── baseAgent.ts          # Legacy base agent class (deprecated)
│   ├── interviewAgent.ts     # Legacy interview conductor (deprecated)
│   ├── conciergeAgent.ts     # Legacy gift recommendation specialist (deprecated)
│   └── index.ts              # Agent exports
├── services/
│   └── authenticatedOpenAIService.ts # Auth state-driven OpenAI client management
├── firebase/
│   ├── firebaseConfig.ts     # Firebase app configuration
│   └── auth.ts               # Authentication providers (Google/GitHub)
├── hooks/
│   ├── useInterviewAgent.ts         # Legacy single-agent hook
│   └── useGiftRecommendationFlow.ts # Main dual-agent orchestration
├── pages/interview/
│   ├── index.tsx             # Main interview container
│   ├── interview.tsx         # Chat layout with scrolling
│   ├── interviewHistory.tsx  # Message history with auto-scroll
│   ├── messageLine.tsx       # Individual message with markdown support
│   └── userPrompt.tsx        # User input component
├── prompts/
│   └── systemPrompts.ts      # AI agent prompts and instructions
├── components/
│   └── pageContainer.tsx     # Full-height page layout
└── types/
    └── index.ts              # TypeScript type definitions
```

### 📋 **Architecture Decision Records (ADRs)**
- **ADR-001**: Use Gift Recommendation Flow with Conversation Continuation
  - Decision to use seamless chat handoff between agents
  - Maintains conversation context and natural user experience
- **ADR-002**: OpenAI Agents SDK with Secure Backend Proxy
  - Use @openai/agents SDK for multi-agent functionality with native handoffs
  - Implement backend proxy to secure API keys from frontend exposure
  - Firebase JWT authentication for authorized API access
- **ADR-003**: Auth State-Driven OpenAI Client Management
  - Use Firebase onAuthStateChanged for real-time auth synchronization
  - Maintain persistent authenticated OpenAI client instead of per-request creation
  - Automatic client lifecycle management (create on login, clear on logout)

### 🎨 **UI/UX Highlights**
- **Bottom-aligned messages**: Chat grows upward naturally
- **Fixed input field**: Always accessible at bottom of screen
- **Responsive design**: Full viewport height utilization
- **Material-UI theming**: Consistent design language
- **Markdown rendering**: Rich text support for formatted recommendations

### 🔄 **Agent Communication**
- **SDK Native Handoffs**: Uses OpenAI Agents SDK built-in handoff capabilities
- **Context preservation**: Full conversation history maintained via AgentInputItem[]
- **Automatic transition**: SDK native handoff detection via trace events
- **Error handling**: Graceful fallback for agent failures and auth issues
- **Real-time Auth**: Firebase auth state changes automatically update OpenAI client

### 🔐 **Security & Authentication**
- **Firebase Authentication**: Google and GitHub OAuth providers with browserLocalPersistence
- **Session Persistence**: Users stay logged in across browser sessions and restarts
- **Secure API Proxy**: Backend handles OpenAI API keys, frontend uses JWT tokens
- **Environment-based Config**: VITE_BACKEND_URL for proxy endpoint configuration
- **Persistent Auth State**: onAuthStateChanged maintains authenticated OpenAI client
- **Automatic Token Refresh**: Service handles JWT token lifecycle management