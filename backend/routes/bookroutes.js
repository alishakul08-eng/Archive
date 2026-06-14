// backend/routes/bookroutes.js

const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById } = require('../controllers/bookcontroller');
const { protect } = require('../middleware/auth'); 

// GET /api/books (Get all books)
// POST /api/books (Create a new book)
router.route('/')
    .post(protect, createBook)
    .get(getBooks); 

// GET /api/books/:id (Get a single book)
router.route('/:id')
    .get(getBookById);

module.exports = router;