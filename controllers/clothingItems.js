const ClothingItems = require('../models/clothingItems');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const errorHandler = require('../middlewares/errorHandler');

const getClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send(items))
    .catch((err) => errorHandler(err, req, res));
};

const createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user._id;

  return ClothingItems.create({ name, weather, imageUrl, owner })
    .then((newItem) => res.status(201).send(newItem))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return new BadRequestError('Invalid clothing item data');
      }
      return errorHandler(err, req, res);
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItems.findById(itemId)
    .then((item) => {
      if (!item) {
        return new NotFoundError('Clothing item not found');
      }
      if (item.owner.toString() !== req.user._id) {
        return new ForbiddenError('You do not have permission to delete this item');
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
        return new BadRequestError('Invalid clothing item ID');
      }
      return errorHandler(err, req, res);
    });
};
const likeItem = (req, res) => ClothingItems.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((item) => {
    if (!item) {
      return new NotFoundError('Clothing item not found');
    }
    return res.send(item);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return new BadRequestError('Invalid clothing item ID');
    }
    return errorHandler(err, req, res);
  });

const dislikeItem = (req, res) => ClothingItems.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((item) => {
    if (!item) {
      return new NotFoundError('Clothing item not found');
    }
    return res.send(item);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return new BadRequestError('Invalid clothing item ID');
    }
    return errorHandler(err, req, res);
  });

module.exports = {
  getClothingItems,
  createClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};