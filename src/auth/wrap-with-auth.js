import React, { useState, useEffect }  from 'react';
import userManager from './user-manager';

function getSigninRedirectUrl() {
  const {href, origin} = window.location;
  return href.replace(origin, '');
}

export default function wrapWithAuth(WrappedComponent) {
  return (props) => {
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const [thing, setUser] = useState(null);

    const checkAuth = async () => {
      const user = await userManager.getUser();
      if (user && !user.expired) {
        userManager.events._userLoaded.raise(user);
        if (!thing) {
            setUser(user);
        }
        setIsAuthenticated(true);
      } else {
        userManager.signinRedirect({
          state: getSigninRedirectUrl(),
        });
      }
    }

    useEffect(() => { checkAuth(); });

    return isAuthenticated && <WrappedComponent user={thing} {...props} />;
  };
}
