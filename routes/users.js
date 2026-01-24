const express = require('express');

const router = express.Router();


const { getUsers, updateUser, getCurrentUser, createUser,loginUser } = require('../controllers/users');


router.get('/', getUsers);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', updateUser);


module.exports = router;