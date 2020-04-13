const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title.']
  },
  description: {
    type: String,
    required: [true, 'Please add a description.']
  },
  weeks: {
    type: Number,
    required: [true, 'Please enter duration of course.']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition fee for course.']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add minimum skill required.'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Review', ReviewSchema);
