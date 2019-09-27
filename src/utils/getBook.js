const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

GetById('25');

function GetById(bookId) {
  const params = {
    TableName: 'Librarian_Books',
    Key: { bookId: bookId }
  };

  docClient.get(params, function(err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data.Item);
    }
  });
}
