/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const chalk = require('chalk');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Colors
const info = chalk.yellow.bold;
const error = chalk.red;

dotenv.config({ path: './config/.env' });

// Connect to DB
connectDB();

// Create express app
const app = express();

// Body Parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Error handler
app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  console.log(info(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))
);

// Handle unhandled promise rejections
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (err, promise) => {
  console.log(error(`Error: ${err.message}`));
  // CLose server and exit
  server.close(() => process.exit(1));
});
