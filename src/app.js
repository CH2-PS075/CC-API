const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use('/auth', authRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () =>
  // eslint-disable-next-line implicit-arrow-linebreak, no-console
  console.log(`Server listening on port ${config.port}`));
