import useVoiceAgent from "../../hooks/useVoiceAgent";
import { Box, CircularProgress } from "@mui/material";
import InterviewHistory from "../components/interviewHistory";
import PageContainer from "../../components/pageContainer";

const VoiceInterview = () => {
  console.log("Rendering VoiceInterview");

  const { loading, messages } = useVoiceAgent();

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer loading={loading}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
      </Box>
    </PageContainer>
  );
};

export default VoiceInterview;
