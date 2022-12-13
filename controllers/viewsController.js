// +++++++++++++++++++++++++++++++++++++++++++
// Imports
// +++++++++++++++++++++++++++++++++++++++++++
const Tour = require('../models/tourModel');
const Bookings = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');

// +++++++++++++++++++++++++++++++++++++++++++
// Overview of all available tours
// +++++++++++++++++++++++++++++++++++++++++++
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

// +++++++++++++++++++++++++++++++++++++++++++
// Get a tour
// +++++++++++++++++++++++++++++++++++++++++++
exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

// +++++++++++++++++++++++++++++++++++++++++++
// Login
// +++++++++++++++++++++++++++++++++++++++++++
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

// +++++++++++++++++++++++++++++++++++++++++++
// Sign up
// +++++++++++++++++++++++++++++++++++++++++++
exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: `Create New Account`
  });
};

// +++++++++++++++++++++++++++++++++++++++++++
// Get account
// +++++++++++++++++++++++++++++++++++++++++++
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

// +++++++++++++++++++++++++++++++++++++++++++
// Get all my bookings
// +++++++++++++++++++++++++++++++++++++++++++

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2)Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

// +++++++++++++++++++++++++++++++++++++++++++
// Update user data
// +++++++++++++++++++++++++++++++++++++++++++
exports.updateUserData = catchAsync(async (req, res, next) => {
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
    user: updatedUser
  });
});
