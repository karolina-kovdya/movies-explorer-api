const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Поле "email" заполнено не корректно',
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
