const axios = require('axios');

fetchBookDetails();

async function fetchBookDetails(isbn) {
  // Query the book database by ISBN code.
  isbn = isbn || '9781451648546'; // Steve Jobs book

  const url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;

  let results;
  await axios.get(url).then(response => {
    results = response.data;
    console.log(results);
  });

  //   const response = await fetch(url);
  //   results = JSON.parse(response);

  console.log(results);
  //   if (results.totalItems) {
  //     // There'll be only 1 book per ISBN
  //     const book = results.items[0];

  //     const title = book['volumeInfo']['title'];
  //     const subtitle = book['volumeInfo']['subtitle'];
  //     const authors = book['volumeInfo']['authors'];
  //     const printType = book['volumeInfo']['printType'];
  //     const pageCount = book['volumeInfo']['pageCount'];
  //     const publisher = book['volumeInfo']['publisher'];
  //     const publishedDate = book['volumeInfo']['publishedDate'];
  //     const webReaderLink = book['accessInfo']['webReaderLink'];

  //     return book;
  //   }
}
