import { EmailAuthProvider } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/cordova";
import { Props, StyledFirebaseAuth } from "react-firebaseui";
import { Navigate } from "react-router-dom";
import { useAuth, useSigninCheck } from "reactfire";

const uiConfig: Props["uiConfig"] = {
  signInFlow: "popup",
  signInSuccessUrl: "/list",
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
    },
    GoogleAuthProvider.PROVIDER_ID,
  ],
};

export function Component() {
  const auth = useAuth();
  const { data, status } = useSigninCheck();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (data?.signedIn) {
    return <Navigate to="/list" />;
  }

  return (
    <main>
      <div className="mt-18">
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    </main>
  );
}

Component.displayName = "Login";
