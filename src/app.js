const express = require('express');
const cors = require('cors');
const multer = require('multer');
const config = require('./config/config');
const router = require('./routes/index');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none(), router);

// INITIAL ENDPOINT
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () =>
  // eslint-disable-next-line implicit-arrow-linebreak, no-console
  console.log(`Server listening on port ${config.port}`));
