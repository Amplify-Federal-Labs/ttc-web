"use client";
import { SignInPage, type AuthResponse } from "@toolpad/core/SignInPage";
import { type Session } from "./SessionContext";
import { signInWithGoogle, signInWithCredentials } from "./firebase/auth";
import { auth } from "./firebase/firebaseConfig";

interface SignInProps {
  onSuccess: (session: Session) => void;
  onFail: (authResponse: AuthResponse) => void;
}
const SignIn = ({ onSuccess, onFail }: SignInProps) => {
  return (
    <SignInPage
      providers={[
        { id: "google", name: "Google" },
        { id: "credentials", name: "Credentials" },
      ]}
      signIn={async (provider, formData) => {
        let authResponse = {};

        let result:
          | {
              success: boolean;
              user?: {
                displayName?: string | null;
                email?: string | null;
                photoURL?: string | null;
              } | null;
              error?: string | null;
            }
          | undefined;

        try {
          if (provider.id === "google") {
            result = await signInWithGoogle();
          }

          if (provider.id === "credentials") {
            const email = formData?.get("email") as string;
            const password = formData?.get("password") as string;

            if (!email || !password) {
              authResponse = { error: "Email and password are required" };
              return authResponse;
            }

            result = await signInWithCredentials(email, password);
          }

          const uid = await auth.currentUser?.getIdToken();

          if (result?.success && result?.user) {
            const userSession: Session = {
              user: {
                uid,
                name: result.user.displayName || "",
                email: result.user.email || "",
                image: result.user.photoURL || "",
              },
            };
            onSuccess(userSession);
            return {};
          } else {
            authResponse = { error: result?.error || "Failed to sign in" };
          }
        } catch (error) {
          authResponse = {
            error: error instanceof Error ? error.message : "An error occurred",
          };
        }

        onFail(authResponse);
        return authResponse;
      }}
    />
  );
};

export default SignIn;
