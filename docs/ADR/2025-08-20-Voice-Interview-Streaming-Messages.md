# ADR-004: Voice Interview Streaming Messages

## Status
Proposed

## Context
The current voice interview implementation using `useVoiceAgent` hook only listens to the `history_updated` event from RealtimeSession, which fires when the entire response is complete. This results in synchronous rendering where messages appear all at once rather than streaming incrementally, creating a less natural conversational experience.

Users expect modern chat interfaces to stream responses character-by-character as the AI generates them, similar to ChatGPT's interface.

## Decision
We will implement streaming behavior for voice interview messages by:

1. **Enhanced Event Listening**: Listen to additional RealtimeSession events beyond `history_updated`
2. **Streaming State Management**: Add streaming-specific state to track partial message content
3. **Progressive Rendering**: Update UI incrementally as message content streams in
4. **Visual Feedback**: Provide typing indicators for active streaming messages

## Technical Implementation

### Message Type Updates
- Add `isStreaming: boolean` flag to Message type
- Add `streamingContent: string` field for partial content during streaming
- Maintain existing `content` field for final complete messages

### Event Handling Strategy
- `agent_start` - Create streaming message placeholder
- `transport_event` - Extract text deltas and update streaming content  
- `audio` - Handle audio streaming with text transcripts
- `history_updated` - Finalize complete messages (existing behavior)

### State Management
- Separate arrays for complete and streaming messages
- Merge for display while preserving chronological order
- Handle edge cases (interrupted streams, errors)

## Consequences

### Positive
- More natural, responsive user experience
- Better perceived performance as users see immediate feedback
- Aligns with modern chat interface expectations
- Maintains compatibility with existing message handling

### Negative
- Increased complexity in state management
- Additional event handling overhead
- Potential for partial message display during network issues
- Need to handle streaming interruption scenarios

## Alternatives Considered
1. **Keep current synchronous approach** - Rejected due to poor UX
2. **Fake streaming with setTimeout** - Rejected as it doesn't reflect actual generation speed
3. **WebSocket-based custom streaming** - Rejected due to SDK limitations and complexity

## Related ADRs
- ADR-002: OpenAI Agents SDK with Secure Backend Proxy
- ADR-003: Auth State-Driven OpenAI Client Management