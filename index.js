import express from 'express';
import Loaders from './bootstrap/index.bootstrap.js';

const app = express();
const port = 3000;

// Create an instance of the Loaders class and load the loaders
const loaders = new Loaders(app);
await loaders.load();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
