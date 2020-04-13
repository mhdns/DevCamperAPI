const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get all reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({ success: true, count: reviews.length, data: reviews });
  }
  return res.status(200).json(res.advancedResults);
});

// @desc      Get a single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!review) {
    return next(new ErrorResponse(`Review with the ID of ${req.params.id} not found.`, 404));
  }
  return res.status(200).json({ success: true, data: review });
});

// @desc      Add review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private/User/Admin
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with the ID of ${req.params.id} not found.`, 404));
  }

  const review = await Review.create(req.body);

  return res.status(201).json({ success: true, data: review });
});

// @desc      Update review
// @route     POST /api/v1/reviews/:id
// @access    Private/User/Admin
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review with the ID of ${req.params.id} not found.`, 404));
  }

  // Check if the review belongs to the user, or the user is an admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not Authorized.', 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  return res.status(200).json({ success: true, data: review });
});
