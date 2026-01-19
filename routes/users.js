const express = require('express');

const router = express.Router();

const { getUsers, getUser, createUser } = require('../controllers/users');


// router.get('/users', getUsers);

// router.get('/users/:userId', getUser);

// router.post('/users', createUser);



module.exports = router;