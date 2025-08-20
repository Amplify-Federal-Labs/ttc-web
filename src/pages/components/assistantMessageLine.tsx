import { Paper } from "@mui/material";
import type { Message } from "../../types";
import MessageLine from "./messageLine";

interface AssistantMessageLineProps {
  message: Message;
}

const AssistantMessageLine = ({ message }: AssistantMessageLineProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        alignSelf: "flex-end",
        padding: 2,
        flexGrow: 3,
      }}
    >
      <MessageLine message={message} />
    </Paper>
  );
};

export default AssistantMessageLine;
