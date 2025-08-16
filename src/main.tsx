import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { AppProvider } from "@toolpad/core/AppProvider";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
