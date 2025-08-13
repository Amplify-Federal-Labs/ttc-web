import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

interface UserPromptProps {
  onEnter: (text: string) => void;
}

const UserPropmt = ({ onEnter }: UserPromptProps) => {
  const [text, setText] = useState("");

  const handleEnter = () => {
    onEnter(text);
    setText("");
  };

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        value={text}
        variant="outlined"
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleEnter();
          }
        }}
        style={{
          flexGrow: 4,
        }}
      />
      <Button
        variant="contained"
        style={{
          flexGrow: 1,
        }}
        onClick={() => handleEnter()}
      >
        Enter
      </Button>
    </Stack>
  );
};

export default UserPropmt;
