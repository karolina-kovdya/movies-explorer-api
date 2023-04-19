const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./middlewares/limiter');
const routes = require('./routes/index');
const config = require('./utils/config');
const errHandler = require('./errors/handler_error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.use(helmet());
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errHandler);

mongoose.set('runValidators', true);
mongoose.connect(config.MONGODB_URL);

app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});
