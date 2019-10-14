import { UserManager} from 'oidc-client';

const userManager = new UserManager({
    authority: process.env.REACT_APP_OIDC_AUTHORITY,
    client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
    redirect_uri: window.location.origin + '/implicit/callback',
    silent_redirect_uri: window.location.origin + '/implicit/callback',
    scope: 'openid email profile',
    response_type: 'token id_token',
    automaticSilentRenew: true
});

window.userManager = userManager;
export default userManager;