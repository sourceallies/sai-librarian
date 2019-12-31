const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const AWS = require('aws-sdk');
const response = require('cfn-response-promise');

// const DBMigrate = require('db-migrate');

async function getDBSecrets() {
    const secretsmanager = new AWS.SecretsManager();
    const response = await secretsmanager.getSecretValue({
        SecretId: process.env.CREDENTIALS_ARN
    }).promise();
    return JSON.parse(response.SecretString);
}

async function setupEnvironment() {
    const {username, password, host} = await getDBSecrets();
    process.env.DB_USERNAME = username;
    process.env.DB_PASSWORD = password;
    process.env.DB_HOST = host;
}

module.exports.runMigrations = async function() {
    // await setupEnvironment();
    // console.log("Environment setup")
    // const dbm = DBMigrate.getInstance(true);
    // await dbm.up();
    // console.log('Migration complete');

    const createSchemaScript = await readFileAsync(__dirname + '/create-schema.sql', 'UTF-8');
    console.log('About to execute', createSchemaScript);

    const dataService = new AWS.RDSDataService();
    await dataService.executeStatement({
        resourceArn: process.env.DATABASE_ARN,
        secretArn: process.env.CREDENTIALS_ARN,
        database: process.env.DATABASE_NAME,
        sql: createSchemaScript
    }).promise();
    console.log('Migration complete');
};

module.exports.handle = async function(event, context) {
    try {
        await this.runMigrations();
        return await response.send(event, context, response.SUCCESS, {});
    } catch (e) {
        console.error('Error migrating', e);
        return await response.send(event, context, response.FAILED, {
            message: e.message,
            stackTrace: e.stackTrace
        });
    }
}