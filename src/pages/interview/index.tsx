import { Box } from "@mui/material";
import Interview from "./interview";
import useAgentSDKFlow from "../../hooks/useAgentSDKFlow";
import PageContainer from "../../components/pageContainer";

const InterviewContainer = () => {
  const { messages, loading, sendMessage } = useAgentSDKFlow();
  const handleUserPrompt = (text: string) => sendMessage(text);

  return (
    <PageContainer loading={loading}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Interview messages={messages} onUserPropmt={handleUserPrompt} />
      </Box>
    </PageContainer>
  );
};

export default InterviewContainer;
