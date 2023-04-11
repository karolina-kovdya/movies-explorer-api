const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.get('/', (req, res) => {
  res.send('hello');
});

mongoose.set('runValidators', true);
mongoose.connect('mongodb://localhost:27017/moviedb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
