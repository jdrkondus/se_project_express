const ClothingItems = require('../models/clothingItems');

const getClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send(items))
    .catch(() => res.status(500).send({ message: 'An error has occurred on the server' }));
};

const createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user._id;

  return ClothingItems.create({ name, weather, imageUrl, owner })
    .then((newItem) => res.status(201).send(newItem))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Invalid clothing item data' });
      }
      return res.status(500).send({ message: 'An error has occurred on the server' });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItems.findById(itemId)
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: 'Clothing item not found' });
        return null;
      }
      if (item.owner.toString() !== req.user._id) {
        res.status(403).send({ message: 'You do not have permission to delete this item' });
        return null;
      }
      // Return the next promise to keep the chain flat
      return ClothingItems.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      // Only send response if deletedItem is not null
      if (deletedItem) {
        res.send(deletedItem);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid clothing item ID' });
      }
      return res.status(500).send({ message: 'An error has occurred on the server' });
    });
};
const likeItem = (req, res) => ClothingItems.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((item) => {
    if (!item) {
      return res.status(404).send({ message: 'Clothing item not found' });
    }
    return res.send(item);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Invalid clothing item ID' });
    }
    return res.status(500).send({ message: 'An error has occurred on the server' });
  });

const dislikeItem = (req, res) => ClothingItems.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((item) => {
    if (!item) {
      return res.status(404).send({ message: 'Clothing item not found' });
    }
    return res.send(item);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Invalid clothing item ID' });
    }
    return res.status(500).send({ message: 'An error has occurred on the server' });
  });

module.exports = {
  getClothingItems,
  createClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};