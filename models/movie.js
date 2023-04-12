const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    required: true,
    type: String,
  },
  director: {
    required: true,
    type: String,
  },
  duration: {
    required: true,
    type: Number,
  },
  year: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return validator.isUrl(v);
      },
      message: 'Некорректный URL',
    },
  },
  trailerLink: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return validator.isUrl(v);
      },
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return validator.isUrl(v);
      },
      message: 'Некорректный URL',
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  movieId: {
    required: true,
    tupe: Number,
  },
  nameRU: {
    required: true,
    type: String,
  },
  nameEN: {
    required: true,
    type: String,
  },
});

const Movie = mongoose.model('user', movieSchema);

module.exports = Movie;