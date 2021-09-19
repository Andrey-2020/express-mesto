const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
app.get('/', (request, response) => {
  response.end('Hello 111 Express!');
});
app.listen(PORT);
