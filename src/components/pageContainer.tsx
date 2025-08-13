import { Backdrop, CircularProgress } from "@mui/material";
import { type ReactElement } from "react";

interface PageContainerProps {
  loading: boolean;
  children: ReactElement;
}
const PageContainer = ({ loading, children }: PageContainerProps) => {
  return (
    <>
      {children}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default PageContainer;
