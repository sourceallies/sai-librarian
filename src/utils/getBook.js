import documentClient from '../configuredDocumentClient';

export const getBookByBookId = (bookId, token) => {
  return documentClient.get({
    TableName: process.env.REACT_APP_BOOK_TABLE,
    Key: {
      bookId
    }
  }).promise();
};
