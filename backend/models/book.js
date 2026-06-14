// backend/models/book.js

const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        author: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        submittedBy: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        genre: { 
            type: String, 
            required: true 
        },
        publicationYear: { 
            type: Number, 
            required: true 
        },
        // ADDED/MODIFIED: ISBN field definition
        
        reviews: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Review' 
        }],
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;