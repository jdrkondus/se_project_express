const ClothingItems = require('../models/clothingItems');

const getClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send(items))
    .catch(() => res.status(500).send({ message: 'Failed to fetch clothing items' }));
};

const createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!req.user) {
    return res.status(500).send({ message: "User not authorized" });
  }

  const owner = req.user._id;

  return ClothingItems.create({ name, weather, imageUrl, owner })
    .then((newItem) => res.status(201).send(newItem))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Invalid user data' });
      }
      return res.status(500).send({ message: 'Failed to create item' });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  return ClothingItems.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: 'Clothing item not found' });
      }
      if (item.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'You do not have permission to delete this item' });
      }
      return ClothingItems.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      if (deletedItem) {
        return res.send(deletedItem);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID format' });
      }
      return res.status(500).send({ message: 'Internal server error' });
    });
};

const likeItem = (req, res) => ClothingItems.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((item) => {
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    return res.send(item);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Invalid ID format' });
    }
    return res.status(500).send({ message: 'Internal server error' });
  });

const dislikeItem = (req, res) => ClothingItems.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((item) => {
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    return res.send(item);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Invalid ID format' });
    }
    return res.status(500).send({ message: 'Internal server error' });
  });

module.exports = {
  getClothingItems,
  createClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};