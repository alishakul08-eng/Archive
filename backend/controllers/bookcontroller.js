// backend/controllers/bookcontroller.js

const asyncHandler = require('express-async-handler');
const Book = require('../models/book');
const mongoose = require('mongoose');

// 🛑 THE FIX: We must load the Review model so Mongoose can find 
//    the schema required for the nested population in getBookById.
// 
// ⚠️ Adjust the path below if your 'review.js' file is located elsewhere 
//    relative to this controller file.
const Review = require('../models/review'); 

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
    // Finds and returns all documents.
    const books = await Book.find({});
    res.json(books);
});

// @desc    Fetch single book details
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
    const bookId = req.params.id;

    // 1. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(404);
        throw new Error('Book not found (Invalid ID format)'); 
    }

    let book;
    
    // 2. Add try...catch for robust database error handling (500)
    try {
        book = await Book.findById(bookId)
            .populate('submittedBy', 'username')
            .populate({
                path: 'reviews', // This requires the 'Review' model to be registered
                populate: {
                    path: 'user',  
                    select: 'username'
                }
            });
    } catch (error) {
        // This catches errors like the "Schema hasn't been registered" error, 
        // allowing us to log it and return a cleaner 404/failure message to the client.
        console.error(`Database Query Error for Book ID ${bookId}:`, error.message);
        res.status(404); 
        throw new Error('Book data retrieval failed. Check server console for details.');
    }

    if (book) {
        res.json(book);
    } else {
        // If the ID format is valid but no book is found.
        res.status(404);
        throw new Error('Book not found');
    }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private (Admin/User)
const createBook = asyncHandler(async (req, res) => {
    const {
        title,
        author,
        description,
        genre,
        publicationYear
    } = req.body;

    // Check for required fields based on your schema
    if (!title || !author || !description || !genre || !publicationYear) {
        res.status(400);
        throw new Error('Please fill all required fields.');
    }

    const book = new Book({
        title,
        author,
        description,
        genre,
        publicationYear,
        submittedBy: req.user._id, // Uses the user ID from auth/middleware
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
});

module.exports = {
    getBooks,
    getBookById,
    createBook
};