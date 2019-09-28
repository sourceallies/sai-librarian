const uuid = require('uuid');
const fs = require('fs');

let file = Array(30).fill(null).map(() => `https://still-cove-56376.herokuapp.com/books/${uuid()}`).join('\n');

fs.writeFileSync('./src/generated-files/testCsv.csv', file);
