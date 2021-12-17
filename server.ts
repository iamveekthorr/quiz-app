import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/.env' });

import app from './app';

let DB: string;

if (
  process.env.DATABASE_URL !== undefined &&
  process.env.DATABASE_PASSWORD !== undefined
) {
  DB = process.env.DATABASE_URL.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful!'));
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
}

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
