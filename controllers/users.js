const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/notFound_error');
const BadRequestError = require('../errors/badRequest_error');
const UnauthorizedError = require('../errors/unauthorized_error');
const ConflictError = require('../errors/conflict_error');
const {
  CREATED, USER_NOT_FOUND, BAD_REQUEST, BAD_EMAIL_PASSWORD, DUBLICATE,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST));

        return;
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST));
        return;
      } if (err.code === 11000) {
        next(new ConflictError(DUBLICATE));
        return;
      }
      next(err);
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError((BAD_EMAIL_PASSWORD));
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (matched) {
          return user;
        }
        throw new UnauthorizedError((BAD_EMAIL_PASSWORD));
      }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'my-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => res.status(CREATED).send({
        name: user.name,
        email: user.email,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError(BAD_REQUEST));
          return;
        } if (err.code === 11000) {
          next(new ConflictError(DUBLICATE));
          return;
        }
        next(err);
      }));
};

module.exports = {
  getCurrentUser, updateUser, loginUser, createUser,
};
