// +++++++++++++++++++++++++++++++++++++++++++
// Imports
// +++++++++++++++++++++++++++++++++++++++++++
const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// +++++++++++++++++++++++++++++++++++++++++++
// Create routes
// +++++++++++++++++++++++++++++++++++++++++++
const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

// +++++++++++++++++++++++++++++++++++++++++++
// Exports
// +++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
