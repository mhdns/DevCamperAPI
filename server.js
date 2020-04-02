const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const chalk = require('chalk');
const bootcamps = require('./routes/bootcamps');
const connectDB = require('./config/db');

// Colors
const info = chalk.yellow.bold;
const error = chalk.red;

dotenv.config({ path: './config/.env' });

// Connect to DB
connectDB();

// Create express app
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Bootcamp Routes
app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(
  process.env.PORT,
  // eslint-disable-next-line no-console
  console.log(info(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(error(`Error: ${err.message}`));
  // CLose server and exit
  server.close(() => process.exit(1));
});
