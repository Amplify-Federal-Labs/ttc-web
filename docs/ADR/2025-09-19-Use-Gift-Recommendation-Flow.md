# ADR-001: Use Gift Recommendation Flow with Conversation Continuation

## Status
Accepted

## Date
2025-09-19

## Context

Our gift recommendation application currently uses a single Interview Agent managed by the `useInterviewAgent` React hook. The application needs to transition from interviewing users about gift recipients to generating personalized gift recommendations.

We have identified a two-agent architecture:
- **Interview Agent**: Conducts conversational interview to build recipient profile
- **Concierge Agent**: Generates gift recommendations based on the profile

The challenge is how to handle the UI transition between these two agents while maintaining a smooth user experience.

## Decision

We will implement a **Conversation Continuation** approach using a new `useGiftRecommendationFlow` hook that manages both agents within a single chat interface.

### Chosen Approach: Conversation Continuation

The flow will work as follows:
1. User starts conversation with Interview Agent
2. When interview completes, show transition message
3. Automatically display Concierge recommendations in same chat
4. User can ask follow-up questions to Concierge

### Implementation Strategy

- Replace `useInterviewAgent` with `useGiftRecommendationFlow`
- Keep existing `Interview` component UI
- Add internal agent state management
- Handle automatic transitions based on conversation state

```typescript
const useGiftRecommendationFlow = () => {
  const [currentAgent, setCurrentAgent] = useState('interview');
  const [allMessages, setAllMessages] = useState([]);
  
  const sendMessage = async (text: string) => {
    if (currentAgent === 'interview') {
      const response = await interviewAgent.sendMessage(text);
      
      if (shouldTransitionToConcierge(response)) {
        // Add transition message
        setAllMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Great! Now let me find some perfect gift recommendations for you...'
        }]);
        
        setCurrentAgent('concierge');
        // Start concierge automatically
        const recommendations = await conciergeAgent.start(profile);
        setAllMessages(prev => [...prev, recommendations]);
      }
    }
  };
};
```

## Alternatives Considered

### 1. State Machine Approach
**Description**: Replace `useInterviewAgent` with `useGiftRecommendationFlow` that manages stages explicitly.
**Pros**: Clear state management, easy to debug
**Cons**: More complex state logic, potential UI jumps

### 2. Route-Based Approach  
**Description**: Separate pages (`/interview` and `/recommendations`) with profile passing.
**Pros**: Clear separation, browser history support
**Cons**: Context loss, navigation overhead, profile state management complexity

### 3. Modal/Stepper Approach
**Description**: Single page with wizard-style steps and clear transitions.
**Pros**: Clear progress indication, familiar UX pattern
**Cons**: Less conversational feel, more complex UI components

## Consequences

### Positive
- **Natural conversation flow**: Users experience seamless transition without jarring page changes
- **Context preservation**: Full conversation history remains visible
- **Simple implementation**: Minimal changes to existing UI components
- **Familiar UX**: Chat-based interface users are accustomed to
- **Easy testing**: Single conversation flow to test

### Negative
- **Mixed agent context**: Single chat contains two different agent personalities
- **State complexity**: Managing agent transitions and message ownership
- **Potential confusion**: Users might not realize they're talking to different agents

### Risks
- **Transition detection**: Need reliable way to detect when interview is complete
- **Agent context bleeding**: Ensuring clean handoff between agents
- **Error handling**: Managing failures during agent transitions

## Implementation Notes

1. **Transition Detection**: Implement `shouldTransitionToConcierge()` function to detect interview completion
2. **Profile Generation**: Interview Agent must generate structured profile before handoff
3. **Message Attribution**: Track which agent generated each message for debugging
4. **Error Boundaries**: Handle agent failures gracefully without breaking conversation flow

## Future Considerations

- **Multi-turn Clarification**: Allow Concierge to request additional information from Interview Agent
- **Conversation Branching**: Support multiple recommendation sessions from same profile
- **Agent Visibility**: Consider showing users which agent they're talking to