import { Paper } from "@mui/material";
import type { Message } from "../../types";
import MessageLine from "./messageLine";

interface UserMessageLineProps {
  message: Message;
}

const UserMessageLine = ({ message }: UserMessageLineProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        alignSelf: "flex-start",
        padding: 2,
        flexGrow: 4,
      }}
    >
      <MessageLine message={message} />
    </Paper>
  );
};

export default UserMessageLine;
