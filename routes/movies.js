const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { postMovieValidation, deleteMovieValidation } = require('../middlewares/celebrateValidation');

router.get('/', getMovies);
router.post('/', postMovieValidation(), createMovie);
router.delete('/:_id', deleteMovieValidation(), deleteMovie);

module.exports = router;
