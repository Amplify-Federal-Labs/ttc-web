# 🎁 AI Gift Recommendation Assistant

A sophisticated gift recommendation application powered by conversational AI that helps users find the perfect gifts with personalized accompanying notes.

## ✨ Features

- **🤖 Dual-Agent AI System**: Interview Agent conducts natural conversations to build recipient profiles, Concierge Agent generates thoughtful recommendations
- **💬 Conversational Interface**: Chat-based experience with seamless agent handoff using OpenAI Agents SDK
- **📝 Personalized Notes**: AI-generated heartfelt messages to accompany each gift suggestion
- **🎨 Rich Formatting**: Markdown support for beautifully formatted recommendations
- **📱 Modern UI**: Material-UI components with responsive design and smooth scrolling
- **🔄 Smart Transitions**: SDK native handoff detection with automatic agent transitions
- **🔐 Secure Authentication**: Firebase Auth with Google/GitHub providers and JWT-secured API proxy
- **💾 Session Persistence**: Users stay logged in across browser sessions with localStorage persistence
- **⚡ Real-time Auth State**: Persistent OpenAI client management with automatic auth synchronization

## 🏗️ Architecture

### Agent System
- **AgentOrchestrator**: Main orchestration using OpenAI Agents SDK with native handoffs
- **Interview Agent**: Conducts comprehensive interviews to understand recipients
- **Concierge Agent**: Creates categorized gift recommendations with personalized notes
- **AuthenticatedOpenAIService**: Manages persistent OpenAI client with Firebase auth integration

### Key Components
- **Gift Recommendation Flow**: Orchestrates dual-agent conversation with SDK native transitions
- **Authentication Service**: Real-time auth state management with automatic client updates
- **Backend API Proxy**: Secure OpenAI API access with JWT token authentication
- **Markdown Rendering**: Rich text display for formatted recommendations
- **Scrollable Chat**: Bottom-aligned messages that grow upward naturally
- **Profile Generation**: Structured data extraction for AI processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project with Authentication enabled
- Backend API proxy server with OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ttc-web-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_BACKEND_URL=https://your-backend-api-proxy.com/v1
   ```

4. **Firebase Configuration**
   Add your Firebase configuration to `firebaseConfig.json`:
   ```json
   {
     "apiKey": "your-firebase-api-key",
     "authDomain": "your-project.firebaseapp.com",
     "projectId": "your-project-id",
     "storageBucket": "your-project.appspot.com",
     "messagingSenderId": "123456789",
     "appId": "your-app-id"
   }
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with UI interface
- `npm run coverage` - Generate test coverage report
- `npm run storybook` - Start Storybook for component development

### Project Structure

```
src/
├── agents/               # AI agent classes and logic
│   ├── agentOrchestrator.ts # Main orchestration with OpenAI Agents SDK
│   ├── baseAgent.ts     # Legacy base agent (deprecated)
│   ├── interviewAgent.ts # Legacy interview conductor (deprecated)
│   └── conciergeAgent.ts # Legacy gift specialist (deprecated)
├── services/            # Core services
│   └── authenticatedOpenAIService.ts # Auth state-driven OpenAI client
├── firebase/            # Firebase integration
│   ├── firebaseConfig.ts # Firebase app configuration
│   └── auth.ts          # Authentication providers
├── hooks/               # React hooks
│   └── useGiftRecommendationFlow.ts # Main agent orchestration
├── pages/interview/     # Chat interface components
│   ├── interview.tsx    # Main chat layout
│   ├── interviewHistory.tsx # Message history
│   ├── messageLine.tsx  # Individual messages with markdown
│   └── userPrompt.tsx   # User input component
├── prompts/            # AI system prompts
│   └── systemPrompts.ts # Agent instructions and guidelines
├── components/         # Shared UI components
│   └── pageContainer.tsx # Full-height layout wrapper
└── types/             # TypeScript definitions
    └── index.ts       # Message and agent types
```

## 📋 User Flow

1. **Authentication**: User signs in with Google or GitHub via Firebase Auth
2. **Start Interview**: User begins conversation with Interview Agent
3. **Profile Building**: Agent asks about recipient, occasion, preferences, and budget
4. **Profile Generation**: AI creates structured markdown summary
5. **SDK Native Handoff**: Automatic transition detected via OpenAI Agents SDK
6. **Gift Recommendations**: Categorized suggestions with personalized notes:
   - Perfect Match: Gifts aligned with main interests
   - Thoughtful Surprise: Unexpected but meaningful options
   - Practical Delight: Useful items for daily life/hobbies
   - Experience Options: Memorable experiences when appropriate

## 🎨 UI/UX Features

- **Bottom-aligned Chat**: Messages start at bottom and grow upward
- **Auto-scroll**: Latest messages automatically stay visible
- **Full Scroll Support**: Can scroll up to view conversation history
- **Responsive Design**: Works on desktop and mobile devices
- **Material-UI Theming**: Consistent, professional appearance
- **Markdown Rendering**: Headers, lists, bold text, and more

## 🤖 AI Integration

### Interview Agent
- Conducts natural, empathetic interviews
- Asks follow-up questions for deeper insights
- Generates structured recipient profiles in markdown format

### Concierge Agent
- Analyzes recipient profiles for gift matching
- Creates categorized recommendations with reasoning
- Generates personalized notes for each gift suggestion
- Provides price ranges and presentation tips

## 📖 Technical Details

### Built With
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Material-UI v7** - Component library and theming
- **Vite** - Fast build tool and dev server
- **OpenAI Agents SDK** - Multi-agent AI system with native handoffs
- **Firebase Auth** - Authentication with Google/GitHub providers
- **React Markdown** - Rich text rendering
- **Vitest** - Fast unit testing framework

### Key Patterns
- **Custom Hooks** - Encapsulated state management
- **Agent Architecture** - OpenAI Agents SDK with native handoffs
- **Service Layer** - AuthenticatedOpenAIService for client management
- **Component Composition** - Reusable UI building blocks
- **Type Safety** - Comprehensive TypeScript coverage
- **Auth State Management** - Firebase onAuthStateChanged integration

## 📝 Documentation

- [Architecture Decision Records](docs/ADR/) - Design decisions and rationale
- [CLAUDE.md](CLAUDE.md) - Detailed project architecture and features

## 🔧 Configuration

The application uses environment variables for configuration:

- `VITE_BACKEND_URL` - Backend API proxy endpoint for secure OpenAI API access

Additional configuration:
- `firebaseConfig.json` - Firebase project configuration for authentication
- Backend proxy server required for OpenAI API key security

## 🚦 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Hosting
- Vercel
- Netlify  
- Firebase Hosting
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Made with ❤️ and AI** - Creating meaningful connections through thoughtful gift-giving.