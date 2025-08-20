import { AppProvider } from "@toolpad/core/AppProvider";
import VoiceInterview from "./pages/voiceInterview";
import SessionContext, { type Session } from "./SessionContext";
import { CircularProgress } from "@mui/material";
import SignIn from "./signIn";
import type { AuthResponse } from "@toolpad/core/SignInPage";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "./firebase/auth";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionContextValue = useMemo(
    () => ({
      session,
      setSession,
      loading,
    }),
    [session, loading]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setSession({
          user: {
            name: user.displayName || "",
            email: user.email || "",
            image: user.photoURL || "",
          },
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  const handleSignInSuccess = (session: Session) => {
    setSession(session);
  };

  const handleSignInFail = (authResponse: AuthResponse) => {
    console.error(`Auth failed: ${authResponse.error}`);
    setSession(null);
  };

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <AppProvider>
        {session ? (
          <VoiceInterview />
        ) : (
          <SignIn onSuccess={handleSignInSuccess} onFail={handleSignInFail} />
        )}
      </AppProvider>
    </SessionContext.Provider>
  );
}

export default App;
