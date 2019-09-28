const AWS = require('aws-sdk');
const {accessKeyId, secretAccessKey} = require('../creds/creds.json');

const credentials = new AWS.Credentials(accessKeyId, secretAccessKey);
AWS.config.update({
    credentials,
    region: 'us-east-2'
});
const dynamoDb = new AWS.DynamoDB();
export const postBook = async (book) => {
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
