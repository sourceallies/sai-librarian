const AWS = require('aws-sdk');
const {accessKeyId, secretAccessKey} = require('../creds/creds.json');

const credentials = new AWS.Credentials(accessKeyId, secretAccessKey);
AWS.config.update({
    credentials,
    region: 'us-east-2'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getBookByBookId = (bookId) => {
  const params = {
    TableName: 'Librarian_Books',
    Key: {
      bookId
    }
  };

  return new Promise((resolve, reject) => {
    dynamoDb.get(params, function(err, data) {
      if (err) reject(err);
      resolve(data);
    });
  })
};
