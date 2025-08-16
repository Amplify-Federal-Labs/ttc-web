import * as React from "react";
import { onAuthStateChanged } from "./firebase/auth";
import SessionContext, { type Session } from "./contexts/SessionContext";
import Interview from "./pages/interview";
import SignIn from "./signIn";
import { CircularProgress } from "@mui/material";

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const sessionContextValue = React.useMemo(
    () => ({
      session,
      setSession,
      loading,
    }),
    [session, loading]
  );

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        const uid = await user.getIdToken();
        setSession({
          user: {
            uid: uid,
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

  return (
    <SessionContext.Provider value={sessionContextValue}>
      {session ? (
        <Interview />
      ) : (
        <SignIn onSuccess={handleSignInSuccess} onFail={() => {}} />
      )}
    </SessionContext.Provider>
  );
}
