const AWS = require('aws-sdk');

AWS.config.region = 'us-east-2';

export const postBook = async (book, token) => {
    AWS.config.region = 'us-east-2';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:cf475bdd-465f-4260-ae06-7d9560f4179d',
        Logins: {
        'accounts.google.com': token
        }
    });
    const dynamoDb = new AWS.DynamoDB();
    const {bookId, title, isbn, isAvailable = true, neckOfTheWoods = 'library', shelf} = book;
    const params = {
        TableName: 'Librarian_Books',
        Item: {
            bookId: {
                S: bookId,
            },
            title: {
                S: title,
            },
            isbn: {
                S: isbn,
            },
            isAvailable: {
                BOOL: isAvailable,
            },
            neckOfTheWoods: {
                S: neckOfTheWoods,
            },
            shelf: {
                S: shelf
            }
        }
    };

    return new Promise((resolve, reject) => {
        dynamoDb.putItem(params, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};
