const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review.'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add some text.']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please a rating from 1-10.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Prevent User from submitting more than one Review per bootcamp
ReviewSchema.index({ user: 1, bootcamp: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
