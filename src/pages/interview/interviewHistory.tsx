import { Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import MessageLine from "./messageLine";

interface InterviewHistoryProps {
  messages: Message[];
}

const InterviewHistory = ({ messages }: InterviewHistoryProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div 
      ref={containerRef}
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: messages.length === 0 ? 'flex-end' : 'flex-start'
      }}
    >
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        {messages.map((message) => (
          <MessageLine key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </Stack>
    </div>
  );
};

export default InterviewHistory;
