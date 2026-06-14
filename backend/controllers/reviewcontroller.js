// backend/controllers/reviewcontroller.js

const asyncHandler = require('express-async-handler');
const Book = require('../models/book'); 
const Review = require('../models/review'); 
const mongoose = require('mongoose');

// @desc    Create a new review for a book
// @route   POST /api/reviews/:bookId
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { rating, headline, text } = req.body;
    
    // Check if user is authenticated (should be done by protect middleware)
    const userId = req.user?._id; 
    if (!userId) {
        // This should not happen if protect middleware works, but is a safe guard
        res.status(401);
        throw new Error('Not authorized. User ID not found from token.');
    }

    if (!rating || !headline || !text || !bookId) {
        res.status(400);
        throw new Error('Rating, headline, and text are required for the review.');
    }
    if (rating < 1 || rating > 5) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5.');
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400);
        throw new Error('Invalid Book ID format.');
    }

    const book = await Book.findById(bookId);

    if (!book) {
        res.status(404);
        throw new Error('Book not found.');
    }

    // 1. Check for existing review (Redundant if unique index is present, 
    // but useful since we deleted the index)
    const existingReview = await Review.findOne({ user: userId, book: bookId });

    if (existingReview) {
        res.status(400);
        throw new Error('Failed to submit review. You may have already reviewed this book.');
    }

    // Create the new review document
    const review = new Review({
        book: bookId,
        user: userId, 
        rating,
        headline,
        text
    });

    let createdReview;
    try {
        // Attempt to save the review
        createdReview = await review.save();

    } catch (e) {
        // Fallback for any database errors during save
        console.error("Mongoose Review Save Error:", e); 
        res.status(500);
        throw new Error('Database error during review submission.');
    }


    // 6. Update the Book document
    book.reviews.push(createdReview._id); 
    
    // Calculate new average rating (unchanged logic)
    const totalRatings = book.reviews.length;
    const allReviews = await Review.find({ book: bookId });
    const sumOfRatings = allReviews.reduce((acc, r) => acc + r.rating, 0);
    book.averageRating = sumOfRatings / totalRatings;
    
    await book.save();

    res.status(201).json({ 
        message: 'Review submitted successfully!',
        review: createdReview,
        book: { averageRating: book.averageRating, reviews: book.reviews.length }
    });
});

// @desc    Get all reviews (for trending page)
// @route   GET /api/reviews
// @access  Public
const getAllReviews = asyncHandler(async (req, res) => {
    // Fetch all reviews and populate user (for username) and book (for title/image)
    const reviews = await Review.find({})
        .populate('user', 'username') 
        .populate('book', 'title coverImage') 
        .sort({ createdAt: -1 }); // Show newest reviews first

    res.json(reviews);
});


module.exports = { 
    createReview,
    getAllReviews // <-- NEW EXPORT
};