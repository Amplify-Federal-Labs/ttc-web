import { Paper, Stack, type SxProps } from "@mui/material";
import type { Message, Role } from "../../types";
import MessageLine from "./messageLine";
import type { Theme } from "@emotion/react";

interface InterviewHistoryProps {
  messages: Message[];
}

const getStyle = (role: Role): SxProps<Theme> => {
  return {
    alignSelf: role == "user" ? "flex-start" : "flex-end",
    padding: 2,
  };
};

const InterviewHistory = ({ messages }: InterviewHistoryProps) => {
  return (
    <Stack spacing={2}>
      {messages.map((message) => (
        <Paper elevation={2} sx={getStyle(message.role)}>
          <MessageLine key={message.content} message={message} />
        </Paper>
      ))}
    </Stack>
  );
};

export default InterviewHistory;
