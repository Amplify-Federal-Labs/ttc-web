# 🎁 AI Gift Recommendation Assistant

A sophisticated gift recommendation application powered by conversational AI that helps users find the perfect gifts with personalized accompanying notes.

## ✨ Features

- **🤖 Dual-Agent AI System**: Interview Agent conducts natural conversations to build recipient profiles, Concierge Agent generates thoughtful recommendations
- **💬 Conversational Interface**: Chat-based experience with seamless agent handoff
- **📝 Personalized Notes**: AI-generated heartfelt messages to accompany each gift suggestion
- **🎨 Rich Formatting**: Markdown support for beautifully formatted recommendations
- **📱 Modern UI**: Material-UI components with responsive design and smooth scrolling
- **🔄 Smart Transitions**: Automatic detection of interview completion with seamless handoff

## 🏗️ Architecture

### Agent System
- **Interview Agent**: Conducts comprehensive interviews to understand recipients
- **Concierge Agent**: Creates categorized gift recommendations with personalized notes
- **Base Agent**: Shared OpenAI integration and message management

### Key Components
- **Gift Recommendation Flow**: Orchestrates dual-agent conversation
- **Markdown Rendering**: Rich text display for formatted recommendations
- **Scrollable Chat**: Bottom-aligned messages that grow upward naturally
- **Profile Generation**: Structured data extraction for AI processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

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
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run storybook` - Start Storybook for component development

### Project Structure

```
src/
├── agents/               # AI agent classes and logic
│   ├── baseAgent.ts     # Base agent with OpenAI integration
│   ├── interviewAgent.ts # Interview conductor
│   └── conciergeAgent.ts # Gift recommendation specialist
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

1. **Start Interview**: User begins conversation with Interview Agent
2. **Profile Building**: Agent asks about recipient, occasion, preferences, and budget
3. **Profile Generation**: AI creates structured markdown summary
4. **Seamless Handoff**: Transition message appears, Concierge Agent takes over
5. **Gift Recommendations**: Categorized suggestions with personalized notes:
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
- **OpenAI API** - GPT-4 for conversational AI
- **React Markdown** - Rich text rendering

### Key Patterns
- **Custom Hooks** - Encapsulated state management
- **Agent Architecture** - Modular AI system design
- **Component Composition** - Reusable UI building blocks
- **Type Safety** - Comprehensive TypeScript coverage

## 📝 Documentation

- [Architecture Decision Records](docs/ADR/) - Design decisions and rationale
- [CLAUDE.md](CLAUDE.md) - Detailed project architecture and features

## 🔧 Configuration

The application uses environment variables for configuration:

- `VITE_OPENAI_API_KEY` - OpenAI API key for AI functionality

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