const AWS = require('aws-sdk');

export const getBookByBookId = (bookId, token) => {
  AWS.config.region = 'us-east-2';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-2:cf475bdd-465f-4260-ae06-7d9560f4179d',
    Logins: {
      'accounts.google.com': token
    }
  });
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
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
