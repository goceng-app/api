import express from 'express';
import Loaders from './bootstrap/index.bootstrap.js';
import dotenv from 'dotenv';
import config from './config.js';

dotenv.config();
const app = express();
const port = config.port;

// Create an instance of the Loaders class and load the loaders
const loaders = new Loaders(app);
await loaders.load();



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
