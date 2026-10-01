const Tour = require('../models/toursModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { paymentsEnabled } = require('./bookingController');

const ALERTS = {
  booking:
    'Your booking was successful! Please check your email for a confirmation.',
  review: 'Thanks for your review!',
  welcome: 'Welcome to Natours! Your account is ready.'
};

// Turns ?alert=<key> into a one-off banner on the rendered page.
exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (ALERTS[alert]) res.locals.alert = ALERTS[alert];
  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find().sort('price');

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // Booking/review state drives the call-to-action at the bottom of the page.
  let hasBooked = false;
  let hasReviewed = false;
  const { user } = res.locals;
  if (user) {
    hasBooked = Boolean(await Booking.exists({ user: user.id, tour: tour.id }));
    hasReviewed = tour.reviews.some(r => r.user && r.user.id === user.id);
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    hasBooked,
    hasReviewed,
    paymentsEnabled: paymentsEnabled()
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    active: 'settings'
  });
};

exports.getMyTours = catchAsync(async (req, res) => {
  // Virtual populate on Tour would also work; two queries keep it simple.
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map(el => el.tour && el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Bookings',
    heading: 'My bookings',
    emptyMessage: "You haven't booked any tours yet.",
    tours
  });
});

exports.getMyReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate({ path: 'tour', select: 'name slug imageCover' })
    .sort('-createdAt');

  res.status(200).render('myReviews', {
    title: 'My Reviews',
    active: 'reviews',
    reviews
  });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    active: 'settings',
    user: updatedUser
  });
});
