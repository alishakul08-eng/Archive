// backend/routes/reviewroutes.js

const express = require('express');
const router = express.Router();
// 🔑 Import both createReview and the new getAllReviews
const { createReview, getAllReviews } = require('../controllers/reviewcontroller');
const { protect } = require('../middleware/auth'); 

// @route   GET /api/reviews
// @desc    Get all reviews (for trending/all reviews page)
// @access  Public
router.route('/')
    .get(getAllReviews); // <-- NEW ROUTE

// @route 	 POST /api/reviews/:bookId
// @desc 	 	Create a new review for a book
// @access 	Private
// Correctly maps the URL parameter to the controller.
router.route('/:bookId')
    .post(protect, createReview);

module.exports = router;