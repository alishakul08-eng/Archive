// frontend/src/components/BookCard.js

import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <Link to={`/book/${book._id}`}> 
        <img 
          src={book.bookCoverUrl || 'https://via.placeholder.com/150x200?text=No+Cover'} 
          alt={book.title} 
        />
        <h4>{book.title}</h4>
      </Link>
      <p>By: {book.author}</p>
      <p className="rating">Rating: {book.averageRating.toFixed(1)} / 5</p>
    </div>
  );
};

export default BookCard;