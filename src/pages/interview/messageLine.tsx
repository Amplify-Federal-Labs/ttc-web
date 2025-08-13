import { Typography } from "@mui/material";
import type { Message, Role } from "../../types";

interface MessageLineProps {
  message: Message;
}

const getColor = (role: Role) => {
  return role == "user" ? "primary" : "secondary";
};

const MessageLine = ({ message }: MessageLineProps) => {
  return (
      <Typography variant="body1" color={getColor(message.role)}>
        {message.content}
      </Typography>
  );
};

export default MessageLine;
