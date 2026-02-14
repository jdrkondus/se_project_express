const mongoose = require('mongoose');
const validator = require('validator');

const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 2,
        maxlength: 30,
    },
     weather: {
        type: String,
        required: [true, "Weather type is required"],
        enum: ['hot', 'warm', 'cold']
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"],
        validate: {
  validator(value) {
    return validator.isURL(value);
  },
  message: 'You must enter a valid URL',
}
    },
   owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'user',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add virtual field for like count
clothingItemSchema.virtual('likesCount').get(function() {
    return this.likes.length;
});

// Ensure virtuals are included when converting to JSON
clothingItemSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        return ret;
    }
});

clothingItemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('clothingItem', clothingItemSchema);