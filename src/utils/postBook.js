import documentClient from '../configuredDocumentClient';

export const postBook = async (book) => {
    return await documentClient.put({
        TableName: process.env.REACT_APP_BOOK_TABLE,
        Item: {
            neckOfTheWoods: 'library',
            isAvailable: true,
            ...book
        }
    }).promise();
};
