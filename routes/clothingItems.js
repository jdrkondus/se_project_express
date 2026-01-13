const express = require('express');
const {getClothingItems, createClothingItems, deleteClothingItem, likeItem, dislikeItem} = require('../controllers/clothingItems');

const router = express.Router();


router.get('/items', getClothingItems);
router.post('/items', createClothingItems);
router.delete('/items/:itemId', deleteClothingItem);
router.put('/items/:itemId/likes', likeItem);
router.delete('/items/:itemId/likes', dislikeItem);

module.exports = router;