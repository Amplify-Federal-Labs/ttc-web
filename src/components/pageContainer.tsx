import { Backdrop, CircularProgress, Container } from "@mui/material";
import { type ReactElement } from "react";

interface PageContainerProps {
  loading: boolean;
  children: ReactElement;
}
const PageContainer = ({ loading, children }: PageContainerProps) => {
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        paddingTop: 2,
        paddingBottom: 2
      }}
    >
      {children}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default PageContainer;
