import { Divider, Stack } from "@mui/material";
import type { Message } from "../../types";
import InterviewHistory from "./interviewHistory";
import UserPropmt from "./userPrompt";

interface InterviewProps {
  messages: Message[];
  onUserPropmt: (prompt: string) => void;
}

const Interview = ({ messages, onUserPropmt }: InterviewProps) => {
  return (
    <Stack
      spacing={2}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <InterviewHistory messages={messages} />
      <UserPropmt onEnter={onUserPropmt} />
    </Stack>
  );
};

export default Interview;
