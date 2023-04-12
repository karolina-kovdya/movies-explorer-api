const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/notFound_error');

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.all(((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
}));

module.exports = router;
