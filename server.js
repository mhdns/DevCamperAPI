const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config/.env' });

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);

app.listen(
  process.env.PORT,
  // eslint-disable-next-line no-console
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
);
