import { useEffect } from 'react';
import UserManager from '../auth/user-manager';

function isReturnFromASilentSignin() {
  return window.location !== window.parent.location;
}

export default function OAuthCallback({ history }) {
  async function handleSigninCallback() {
    const user = await UserManager.signinRedirectCallback();
    const url = user.state || '/';
    history.replace(url);
  }

  useEffect(() => {
    if (isReturnFromASilentSignin()) {
      UserManager.signinSilentCallback();
    } else {
      handleSigninCallback();
    }
  });

  return null;
}
