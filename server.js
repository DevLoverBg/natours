// +++++++++++++++++++++++++++++++++++++++++++
// Server
// +++++++++++++++++++++++++++++++++++++++++++
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// +++++++++++++++++++++++++++++++++++++++++++
// Uncaught exception
// +++++++++++++++++++++++++++++++++++++++++++
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// +++++++++++++++++++++++++++++++++++++++++++
// Database connection
// +++++++++++++++++++++++++++++++++++++++++++
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

// +++++++++++++++++++++++++++++++++++++++++++
// Server connection
// +++++++++++++++++++++++++++++++++++++++++++
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// +++++++++++++++++++++++++++++++++++++++++++
// SIGTERM signal sent through Heroku
// +++++++++++++++++++++++++++++++++++++++++++
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVER. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
