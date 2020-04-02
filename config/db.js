const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async () => {
  const db = chalk.cyan.underline.bold;
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  // eslint-disable-next-line no-console
  console.log(db(`MongoDB Connected: ${conn.connection.host}`));
};

module.exports = connectDB;
