const express = require('express');

const router = express.Router();


const { getUsers, updateUser, getCurrentUser } = require('../controllers/users');


router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.patch('/me', updateUser);

module.exports = router;