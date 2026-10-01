const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Uncaught exceptions — log and exit; the process is in an unknown state.
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...', err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const missing = ['DATABASE', 'JWT_SECRET'].filter(key => !process.env[key]);
if (missing.length) {
  console.error(
    `Missing required env vars: ${missing.join(', ')}.\n` +
      'Copy config.env.example to config.env and fill them in.'
  );
  process.exit(1);
}

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD || ''
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful'))
  .catch(err => {
    console.error('DB connection error:', err.message);
    process.exit(1);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Natours running on http://localhost:${port} (${app.get('env')})`);
});

// Unhandled promise rejections — close the server gracefully, then exit.
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION 💥 Shutting down...', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown on platform stop signals (Docker, Render, Heroku...).
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => mongoose.connection.close(false));
});
