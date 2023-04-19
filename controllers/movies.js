const Movie = require('../models/movie');
const { CREATED } = require('../utils/constants');
const BadRequestError = require('../errors/badRequest_error');
const NotFoundError = require('../errors/notFound_error');
const ForbiddenError = require('../errors/forbidden_error');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));

        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм по указанному id не найден');
      } else if (req.user._id !== movie.owner._id.toString()) {
        throw new ForbiddenError('Нет прав на удаление даноого фильма');
      }
      return movie.deleteOne().then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};
module.exports = {
  getMovies, createMovie, deleteMovie,
};
