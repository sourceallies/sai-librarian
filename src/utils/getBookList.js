import documentClient from '../configuredDocumentClient';

export default async function getBookList() {
    return await documentClient.scan({
        TableName: process.env.REACT_APP_BOOK_TABLE
    }).promise();
}
