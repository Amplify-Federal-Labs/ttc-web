import useVoiceAgent from "../../hooks/useVoiceAgent";
import { Box, CircularProgress } from "@mui/material";
import InterviewHistory from "../components/interviewHistory";

const VoiceInterview = () => {
  console.log('Rendering VoiceInterview');
  
  const { loading, messages } = useVoiceAgent();

  if (loading) {
    return <CircularProgress />;
  }

  return (
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
  );
};

export default VoiceInterview;
