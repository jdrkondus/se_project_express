const user = require('../models/users');
const errorHandler = require('../middlewares/errorHandler');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const saltRounds = 10;

const getUsers = (req, res) => {
  user.find({})
    .then((users) => res.send(users))
    .catch((err) => errorHandler(err, req, res));
};

const getCurrentUser = (req, res) => {
  user.findById(req.user._id)
    .then((userData) => {
      if (!userData) {
        return new NotFoundError('User not found');
      }
      return res.status(200).send(userData);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return new BadRequestError('Invalid user ID');
      }
      return errorHandler(err, req, res);
    });
};

const createUser = (req, res) => {
  const { name, avatar, password, email } = req.body;

  return bcrypt.hash(password, saltRounds)
    .then((hashedPassword) => user.create({ name, avatar, password: hashedPassword, email }))
    .then((newUser) => {
      const userObj = newUser.toObject();
      delete userObj.password;
      const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.status(201).send({token, user: userObj});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return new BadRequestError('Invalid user data');
      }
      if (err.code === 11000) {
        return new ConflictError('Email already in use');
      }
      return errorHandler(err, req, res);
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return new BadRequestError('Email and password are required');
  }

  return user.findUserByCredentials(email, password)
    .then((loggedInUser) => {
      const token = jwt.sign({ _id: loggedInUser._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      const userObj = loggedInUser.toObject();
      delete userObj.password;
      return res.send({ token, user: userObj });
    })
    .catch(() => {
      return new UnauthorizedError('Invalid email or password');
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return new NotFoundError('User not found');
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return new BadRequestError('Invalid user ID');
      }
      if (err.name === 'ValidationError') {
        return new BadRequestError('Invalid user data');
      }
      return errorHandler(err, req, res);
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  loginUser,
  updateUser,
};