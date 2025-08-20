import { Paper, Typography, type SxProps, type Theme } from "@mui/material";
import ReactMarkdown from "react-markdown";
import type { Message, Role } from "../../types";

interface MessageLineProps {
  message: Message;
}

const getColor = (role: Role) => {
  return role == "user" ? "primary" : "secondary";
};

const hasMarkdown = (content: string): boolean => {
  const markdownPatterns = [
    /^#{1,6}\s/m, // Headers
    /\*\*.*\*\*/, // Bold
    /\*.*\*/, // Italic
    /^\s*[*\-+]\s/m, // Bullet lists
    /^\s*\d+\.\s/m, // Numbered lists
    /```[\s\S]*```/, // Code blocks
    /`.*`/, // Inline code
    /\[.*\]\(.*\)/, // Links
  ];

  return markdownPatterns.some((pattern) => pattern.test(content));
};

const MessageLine = ({ message }: MessageLineProps) => {
  if (message.content == "") {
    return <></>;
  }

  const isMarkdown = hasMarkdown(message.content);

  return (
    <>
      {isMarkdown ? (
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <Typography
                variant="body1"
                color={getColor(message.role)}
                sx={{ mb: 1 }}
              >
                {children}
              </Typography>
            ),
            h1: ({ children }) => (
              <Typography
                variant="h4"
                color={getColor(message.role)}
                gutterBottom
              >
                {children}
              </Typography>
            ),
            h2: ({ children }) => (
              <Typography
                variant="h5"
                color={getColor(message.role)}
                gutterBottom
              >
                {children}
              </Typography>
            ),
            h3: ({ children }) => (
              <Typography
                variant="h6"
                color={getColor(message.role)}
                gutterBottom
              >
                {children}
              </Typography>
            ),
            strong: ({ children }) => (
              <Typography component="strong" sx={{ fontWeight: "bold" }}>
                {children}
              </Typography>
            ),
            li: ({ children }) => (
              <Typography
                component="li"
                variant="body1"
                color={getColor(message.role)}
              >
                {children}
              </Typography>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      ) : (
        <Typography variant="body1" color={getColor(message.role)}>
          {message.content}
        </Typography>
      )}
    </>
  );
};

export default MessageLine;
