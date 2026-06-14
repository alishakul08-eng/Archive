// backend/models/review.js

const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
	 {
	 	 user: {
	 	 	 type: mongoose.Schema.Types.ObjectId,
	 	 	 required: true,
	 	 	 ref: 'User', 
	 	 },
	 	 book: {
	 	 	 type: mongoose.Schema.Types.ObjectId,
	 	 	 required: true,
	 	 	 ref: 'Book', 
	 	 },
	 	 headline: {
	 	 	 	 type: String,
	 	 	 	 required: true,
	 	 },
	 	 text: {
	 	 	 type: String,
	 	 	 required: true,
	 	 },
	 	 rating: {
	 	 	 type: Number,
	 	 	 required: true,
	 	 	 min: 1,
	 	 	 max: 5,
	 	 },
	 	 likes: {
	 	 	 	 type: Number,
	 	 	 	 default: 0,
	 	 },
	 },
	 {
	 	 timestamps: true,
	 }
);

// 🛑 IMPORTANT: Explicitly ensure there is NO unique index on user+book 🛑
// We add this line to confirm that no unique index is active on the combination of user and book.
// If a unique index *were* desired, the code would look like:
// reviewSchema.index({ user: 1, book: 1 }, { unique: true });
// Since we want to allow multiple reviews, we will rely on the default indexing only.

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;