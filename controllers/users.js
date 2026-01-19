const user = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const saltRounds = 10;

const getUsers = (req, res) => {
  user.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'An error has occurred on the server' }));
};

const getCurrentUser = (req, res) => {
  user.findById(req.user._id)
    .then((userData) => {
      if (!userData) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid user ID' });
      }
      return res.status(500).send({ message: 'An error has occurred on the server' });
    });
};

const createUser = (req, res) => {
  const { name, avatar, password, email } = req.body;

  return bcrypt.hash(password, saltRounds)
    .then((hashedPassword) => user.create({ name, avatar, password: hashedPassword, email }))
    .then((newUser) => {
      const userObj = newUser.toObject();
      delete userObj.password;
      return res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Invalid user data' });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Email already in use' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  return user.findUserByCredentials(email, password)
    .then((loggedInUser) => {
      const token = jwt.sign({ _id: loggedInUser._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.send({ token });
    })
    .catch(() => {
      return res.status(401).send({ message: 'Invalid email or password' });
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
        return res.status(404).send({ message: 'User not found' });
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid user ID' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Invalid user data' });
      }
      return res.status(500).send({ message: 'An error has occurred on the server' });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  loginUser,
  updateUser,
};