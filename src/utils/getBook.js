const AWS = require('aws-sdk');
const {accessKeyId, secretAccessKey} = require('../creds/creds.json');

const credentials = new AWS.Credentials(accessKeyId, secretAccessKey);
AWS.config.update({
    credentials, 
    region: 'us-east-2' 
});

const dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

export const getBookByBookId = (bookId) => {
  const params = {
    TableName: 'Librarian_Books',
    Key: { bookId: bookId }
  };

  return new Promise((resolve, reject) => {
    dynamoDb.getItem(params, function(err, data) {
      if (err) reject(err);
      resolve(data);
    });
  })
}
