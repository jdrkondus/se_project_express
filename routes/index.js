const express = require('express');

const router = express.Router();

const { loginUser, createUser } = require('../controllers/users');

router.post('/users/signin', loginUser);

router.post('/users/signup', createUser);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', createUser, { new: true, runValidators: true });

module.exports = router;