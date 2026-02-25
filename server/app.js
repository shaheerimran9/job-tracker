const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
}

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const auth = require('./middleware/auth');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', auth, jobRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;