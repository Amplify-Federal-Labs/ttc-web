import { Box, Divider, Stack } from "@mui/material";
import type { Message } from "../../types";
import InterviewHistory from "../components/interviewHistory";
import UserPropmt from "./userPrompt";

interface InterviewProps {
  messages: Message[];
  onUserPropmt: (prompt: string) => void;
}

const Interview = ({ messages, onUserPropmt }: InterviewProps) => {
  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          minHeight: 0,
          padding: 1,
        }}
      >
        <InterviewHistory messages={messages} />
      </Box>

      <Divider />

      <Box
        sx={{
          flexShrink: 0,
          padding: 1,
        }}
      >
        <UserPropmt onEnter={onUserPropmt} />
      </Box>
    </Stack>
  );
};

export default Interview;
