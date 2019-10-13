import AWS from 'aws-sdk';
import userManager from '../auth/user-manager';

export default async function getBookList() {
    const user = await userManager.getUser();

    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.WebIdentityCredentials({
        RoleArn: process.env.REACT_APP_ROLE_ARN,
        WebIdentityToken: user.id_token
    });
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    return await dynamoDb.scan({
        TableName: process.env.REACT_APP_BOOK_TABLE
    }).promise();
}
