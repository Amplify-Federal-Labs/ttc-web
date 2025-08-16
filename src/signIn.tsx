import {
  SignInPage,
  type AuthProvider,
  type AuthResponse,
} from "@toolpad/core/SignInPage";
import { type Session } from "./contexts/SessionContext";
import { signInWithGoogle, signInWithCredentials } from "./firebase/auth";
import { auth } from "./firebase/firebaseConfig";

interface SignInProps {
  onSuccess: (session: Session) => void;
  onFail: (authResponse: AuthResponse) => void;
}

export default function SignIn({ onSuccess, onFail }: SignInProps) {
  const handleSignIn = async (
    provider: AuthProvider,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData?: any
  ): Promise<AuthResponse> => {
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
          onFail({ error: "Email and password are required" });
          return {};
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
      } else {
        onFail({ error: result?.error || "Failed to sign in" });
      }
    } catch (error) {
      onFail({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }

    return {};
  };

  return (
    <SignInPage
      providers={[
        { id: "google", name: "Google" },
        { id: "credentials", name: "Credentials" },
      ]}
      signIn={handleSignIn}
    />
  );
}
