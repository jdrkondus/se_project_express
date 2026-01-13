const user = require('../models/users');

const getUsers = (req, res) => {
  user.find({}).then((users) => {
    res.send(users);
  }).catch((err) => {
    res.status(500).send({ message: 'Failed to fetch users' });
  });
}

const getUser = (req, res) => {
  user.findById(req.params.userId).then((userData) => {
    if (!userData) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.send(userData);
  }).catch((err) => {
    res.status(400).send({ message: 'Failed to fetch user' });
  });
}

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  user.create({name, avatar}).then((newUser) => {
    res.status(201).send(newUser);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Invalid user data' });
    } else {
      res.status(500).send({ message: 'Failed to create user' });
    }
  });
}


module.exports = {
  getUsers,
  getUser,
  createUser
};