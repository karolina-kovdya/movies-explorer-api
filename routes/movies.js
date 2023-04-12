const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const regex = /^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/;

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regex),
    trailerLink: Joi.string().required().pattern(regex),
    thumbnail: Joi.string().required().pattern(regex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24).hex(),
  }),
}), deleteMovie);
