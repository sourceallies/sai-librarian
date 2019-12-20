const AWS = require('aws-sdk');

async function getDBSecrets() {
    const secretsmanager = new AWS.SecretsManager();
    const response = await secretsmanager.getSecretValue({
        SecretId: process.env.CREDENTIALS_ARN
    }).promise();
    return JSON.parse(response.SecretString);
}

module.exports.handle = async function(...args) {
    console.log(JSON.stringify(args, null, 2));
    console.log(JSON.stringify(process.env, null, 2));
    await getDBSecrets();
}