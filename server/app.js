const express = require('express');
const app = express();
require('express-async-errors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const auth = require('./middleware/auth');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', auth, jobRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;