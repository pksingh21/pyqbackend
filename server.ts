import 'reflect-metadata';

import app from './app';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting Down...');
  console.log(err.name, err.message);

  process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
  console.log(err.name, err);
  console.log('UNHANDLED REJECTION! 💥 Shutting Down...');

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
