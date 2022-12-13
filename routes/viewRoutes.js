// +++++++++++++++++++++++++++++++++++++++++++
// Imports
// +++++++++++++++++++++++++++++++++++++++++++
const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

// +++++++++++++++++++++++++++++++++++++++++++
// Routes
// +++++++++++++++++++++++++++++++++++++++++++
const router = express.Router();

// Tours pages
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
// Login
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

// Create user
router.get('/signup', viewsController.getSignUpForm);

// User
router.get('/me', authController.protect, viewsController.getAccount);

//Bookings
router.get('/my-bookings', authController.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

// +++++++++++++++++++++++++++++++++++++++++++
// Exports
// +++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
