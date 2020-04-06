const axios = require('axios');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to be removed from matching
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create new string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators $gt, $gte, ...
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // Finding Resource
  const query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.replace(',', ' ');
    query.select(fields);
  }

  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.select.replace(',', ' ');
    query.sort(sortBy);
  } else {
    query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query.skip(startIndex).limit(limit);

  // Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  // Executing Query
  const bootcamps = await query;

  return res.status(200).json({
    success: true, pagination, count: bootcamps.length, data: bootcamps
  });
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
  }
  return res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  return res.status(201).json({
    success: true,
    data: bootcamp
  });
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
  }

  return res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
  }

  bootcamp.remove();

  return res.status(200).json({ success: true, data: {} });
});

// @desc      Get bootcamp within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // Get lat/lon from geocoder
  const loc = await axios({
    method: 'GET',
    url: 'http://www.mapquestapi.com/geocoding/v1/address',
    params: {
      key: `${process.env.GEOCODER_API_KEY}`,
      location: `${zipcode}`
    }
  });

  // Get lat and lon
  const { lat, lng } = loc.data.results[0].locations[0].latLng;

  // Calc radius using radians
  // Divide dist by radius of earth
  // Earth radius = 3963 mi / 6378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
