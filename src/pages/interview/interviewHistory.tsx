import { Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import MessageLine from "./messageLine";

interface InterviewHistoryProps {
  messages: Message[];
}

const InterviewHistory = ({ messages }: InterviewHistoryProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Stack spacing={2}>
      {messages.map((message) => (
        <MessageLine key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </Stack>
  );
};

export default InterviewHistory;
