const router = require('express').Router();
const NotFoundError = require('../errors/notFound_error');
const { loginUser, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { loginUserValidation, authUserValidation } = require('../middlewares/celebrateValidation');
const { PAGE_NOT_FOUND } = require('../utils/constants');

router.post(
  '/signin',
  loginUserValidation(),
  loginUser,
);
router.post(
  '/signup',
  authUserValidation(),
  createUser,
);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use(((req, res, next) => {
  next(new NotFoundError(PAGE_NOT_FOUND));
}));

module.exports = router;
