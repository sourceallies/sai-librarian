import AWS from 'aws-sdk';
import userManager from './auth/user-manager';

AWS.config.region = 'us-east-1';

const webIdentityCreds = new AWS.WebIdentityCredentials({
    RoleArn: process.env.REACT_APP_ROLE_ARN

});
AWS.config.credentials = webIdentityCreds;

userManager.events.addUserLoaded((user) => {
    webIdentityCreds.params.WebIdentityToken = user.id_token;
});

export default new AWS.DynamoDB.DocumentClient();