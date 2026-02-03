const express = require('express');

const router = express.Router();


const { getUsers, updateUser, getCurrentUser, createUser,loginUser } = require('../controllers/users');


router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.patch('/me', updateUser);

// router.post('/signup', createUser);

// router.post('/signin', loginUser);


module.exports = router;