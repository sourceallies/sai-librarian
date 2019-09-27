const uuid = require('uuid');
const fs = require('fs');

let file = Array(30).fill(null).map(() => `https://library.sourceallies.com/books/${uuid()}`).join(',');
fs.writeFileSync('./generated-files/testCsv.csv', file);
console.log('done');
