const express = require('express');
const app = express();

const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

app.get('/', (req, res) => {
    res.send('Test');
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;