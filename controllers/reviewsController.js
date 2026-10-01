const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.setUserAndTourIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // Always review as yourself — ignore any user id sent by the client.
  req.body.user = req.user.id;
  next();
};

// Only travellers who actually booked a tour may review it.
exports.checkHasBooked = catchAsync(async (req, res, next) => {
  const booked = await Booking.exists({
    user: req.user.id,
    tour: req.body.tour
  });
  if (!booked) {
    return next(new AppError('You can only review tours you have booked.', 403));
  }
  next();
});

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
