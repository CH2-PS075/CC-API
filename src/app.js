const express = require('express');
const cors = require('cors');
const config = require('./config/config');

const app = express();

app.use(cors());
app.use(express.json());

app.listen(config.port, () =>
  // eslint-disable-next-line implicit-arrow-linebreak, no-console
  console.log(`Server listening on port ${config.port}`)
);
