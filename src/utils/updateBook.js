import documentClient from '../configuredDocumentClient';

export const updateBook = (book) => {
    const params = {
        TableName: process.env.REACT_APP_BOOK_TABLE,
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

    return documentClient.update(params).promise();
};
