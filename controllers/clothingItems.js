const clothingItems = require('../models/clothingItems');


const getClothingItems = (req, res) => {
  clothingItems.find({}).then((items) => {
    res.send(items);
  }).catch((err) => {
    res.status(500).send({ message: 'Failed to fetch clothing items' });
  });
}

const createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!req.user) {
    return res.status(500).send({ message: "User not authorized" });
  }

  const owner = req.user._id;

  clothingItems.create({name, weather, imageUrl, owner}).then((newItem) => {
    res.status(201).send(newItem);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Invalid user data' });
    } else {
      res.status(500).send({ message: 'Failed to create user' });
    }
  });

}

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  clothingItems.findByIdAndDelete(itemId)
    .then((deletedItem) => {
      if (!deletedItem) {
        // Change 400 to 404
        return res.status(404).send({ message: 'Clothing item not found' });
      }
      return res.send(deletedItem);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Keep this 400 - it handles invalid ID formats (like "text")
        return res.status(400).send({ message: 'Invalid ID format' });
      }
      return res.status(500).send({ message: 'Internal server error' });
    });
};

const likeItem = (req, res) => {
  clothingItems.findByIdAndUpdate(
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
};

const dislikeItem = (req, res) => {
  clothingItems.findByIdAndUpdate(
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
};

module.exports = {
  getClothingItems,
  createClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem
}
