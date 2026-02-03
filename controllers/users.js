const user = require('../models/users');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const saltRounds = 10;

const getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.json(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  user.findById(req.user._id)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('User not found');
      }
      return res.status(200).json(userData);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid user ID'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, password, email } = req.body;

  return bcrypt.hash(password, saltRounds)
    .then((hashedPassword) => user.create({ name, avatar, password: hashedPassword, email }))
    .then((newUser) => {
      const userObj = newUser.toObject();
      delete userObj.password;
      const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.status(201).json({token, user: userObj});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid user data'));
      } else if (err.code === 11000) {
        next(new ConflictError('Email already in use'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return next(new BadRequestError('Email and password are required'));
  }

  return user.findUserByCredentials(email, password)
    .then((loggedInUser) => {
      const token = jwt.sign({ _id: loggedInUser._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      const userObj = loggedInUser.toObject();
      delete userObj.password;
      return res.json({ token, user: userObj });
    })
    .catch(() => {
      next(new UnauthorizedError('Invalid email or password'));
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError('User not found');
      }
      return res.json(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid user ID'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid user data'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  loginUser,
  updateUser,
};