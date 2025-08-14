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
- **AI Integration**: OpenAI API with structured prompts
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
│   ├── baseAgent.ts          # Base agent class with OpenAI integration
│   ├── interviewAgent.ts     # Interview conductor
│   ├── conciergeAgent.ts     # Gift recommendation specialist
│   └── index.ts              # Agent exports
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

### 🎨 **UI/UX Highlights**
- **Bottom-aligned messages**: Chat grows upward naturally
- **Fixed input field**: Always accessible at bottom of screen
- **Responsive design**: Full viewport height utilization
- **Material-UI theming**: Consistent design language
- **Markdown rendering**: Rich text support for formatted recommendations

### 🔄 **Agent Communication**
- **Profile-based handoff**: Interview agent generates structured profile
- **Context preservation**: Full conversation history maintained
- **Automatic transition**: Smart detection of interview completion
- **Error handling**: Graceful fallback for agent failures