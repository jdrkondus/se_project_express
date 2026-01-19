const user = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const saltRounds = 10;

const getUsers = (req, res) => {
  user.find({}).then((users) => res.send(users)).catch(() => res.status(500).send({ message: 'Failed to fetch users' }));
}

const getCurrentUser = (req, res) => {
  user.findById(req.user._id).then((userData) => {
    if (!userData) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.send(userData);
  }).catch(() => {
    res.status(400).send({ message: 'Failed to fetch user' });
  });
}

const createUser = (req, res) => {
  const { name, avatar, password } = req.body;

  return bcrypt.hash(password, saltRounds)
    .then((hashedPassword) => user.create({ name, avatar, password: hashedPassword }))
    .then((newUser) => {
      User.findOne({ email }).select('+password')
 .then((user) => {
      if (!user) {
        return Promise.reject(new Error('User not found'));
      }
      return bcrypt.compare(password, user.password)
        .then((isPasswordMatch) => {
          if (!isPasswordMatch) {
            return Promise.reject(new Error('Incorrect password'));
          }
          return user;
        });
 });
      delete newUser.password;
      return res.status(201).send(newUser);
    })
    .catch(() => res.status(409).send({ message: 'Invalid user data' }));
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  return user.findUserByCredentials(email, password)
    .then((loggedInUser) => {
      const token = jwt.sign({ _id: loggedInUser._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: 'Invalid email or password' });
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
    .catch(() => {
      res.status(400).send({ message: 'Failed to update user' });
    });};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  loginUser,
  updateUser,
};