const AWS = require('aws-sdk');

AWS.config.region = 'us-east-2';

export const updateBook = (book, token) => {
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
