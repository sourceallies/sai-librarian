const AWS = require('aws-sdk');
const {accessKeyId, secretAccessKey} = require('../creds/creds.json');

const credentials = new AWS.Credentials(accessKeyId, secretAccessKey);
AWS.config.update({
    credentials,
    region: 'us-east-2'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const updateBook = (book) => {
    const params = {
        TableName: 'Librarian_Books',
        Key: {
            bookId: book.bookId
        },

        // so...location is a reserved word
        UpdateExpression: "set title=:t, isbn=:i, isAvailable=:a, neckOfTheWoods=:l, shelf=:s",
        ExpressionAttributeValues: {
            ':t': book.title,
            ':i': book.isbn,
            ':a': book.isAvailable,
            ':l': book.neckOfTheWoods,
            ':s': book.shelf
        },
        ReturnValues: 'UPDATED_NEW'
    };

    return new Promise((resolve, reject) => {
        dynamoDb.update(params, function(err, data) {
           if (err) reject(err);
           resolve(data);
        });
    })
};
