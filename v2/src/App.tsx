import { useContext } from 'react';
import './App.css';
import { AuthContext, AuthProvider, TAuthConfig, IAuthContext } from "react-oauth2-code-pkce"


const authConfig: TAuthConfig = {
  clientId: "2c5608d2-366b-4591-ae06-ad8ebd1e54a7",
  authorizationEndpoint: 'https://login.microsoftonline.com/772f497a-f0cb-47c2-a5ef-118bb35e3703/oauth2/v2.0/authorize',
  tokenEndpoint: 'https://login.microsoftonline.com/772f497a-f0cb-47c2-a5ef-118bb35e3703/oauth2/v2.0/token',
  redirectUri: window.origin,
  scope: 'openid email',
};

function LoginTest() {
  const { idToken } = useContext<IAuthContext>(AuthContext);

  return (
    <div>Logged In: {idToken}</div>
  )
}

function AuthGuard({children}: JSX.ElementChildrenAttribute) {
  const { idToken } = useContext<IAuthContext>(AuthContext);
  if (idToken) {
    return <>{children}</>;
  }
  return <div>Logging In</div>;
}

export default function App() {
  return (
    <AuthProvider authConfig={authConfig} >
      <AuthGuard>
        <LoginTest />
      </AuthGuard>
    </AuthProvider>
  );
}
