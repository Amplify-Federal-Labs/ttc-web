import { Box } from "@mui/material";
import Interview from "./interview";
import useOpenAIChat from "../../hooks/useOpenAI";
import PageContainer from "../../components/pageContainer";

const InterviewContainer = () => {
  const { messages, loading, sendMessage } = useOpenAIChat();
  const handleUserPrompt = (text: string) => {
    console.log(`Received user prompt ${text}`)
    sendMessage(text);
  };

  return (
    <PageContainer loading={loading}>
      <Box padding={2}>
        <Interview messages={messages} onUserPropmt={handleUserPrompt} />
      </Box>
    </PageContainer>
  );
};

export default InterviewContainer;
