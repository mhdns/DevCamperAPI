const express = require('express');
const dotenv = require('dotenv');

// Import bootcamps router
const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config/.env' });

const app = express();

app.use('/api/v1/bootcamps', bootcamps);

app.listen(
  process.env.PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
);
