import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

// --- Styled Components (omitted for brevity) ---

const ReviewSubmitContainer = styled.div`
	 min-height: 80vh;
	 background-color: #fffafb; // Light blush background
	 padding: 50px 20px;
	 display: flex;
	 justify-content: center;
`;

const FormWrapper = styled.div`
	 max-width: 800px;
	 width: 100%;
	 background: white;
	 border-radius: 15px;
	 box-shadow: 0 8px 25px rgba(255, 105, 180, 0.15);
	 padding: 40px;

	 @media (max-width: 768px) {
	 	 padding: 25px;
	 }
`;

const Header = styled.header`
	 text-align: center;
	 margin-bottom: 30px;
`;

const Title = styled.h1`
	 font-size: 2.5rem;
	 color: #ff69b4; 
	 margin-bottom: 5px;
	 font-family: 'Playfair Display', serif;
`;

const Subtitle = styled.p`
	 font-size: 1.2rem;
	 color: #666;
`;

const BookHighlight = styled.span`
	 	 font-style: italic;
	 	 font-weight: bold;
	 	 color: #ff4081;
`;

const ReviewForm = styled.form`
	 display: flex;
	 flex-direction: column;
`;

const InputGroup = styled.div`
	 margin-bottom: 25px;
`;

const Label = styled.label`
	 display: block;
	 font-size: 1.1rem;
	 color: #333;
	 margin-bottom: 10px;
	 font-weight: 600;
`;

const RatingWrapper = styled.div`
	 	 display: flex;
	 	 gap: 10px;
	 	 font-size: 2rem;
	 	 color: #f7a400; 
`;

const StarIcon = styled.span`
	 	 cursor: pointer;
	 	 transition: color 0.2s, transform 0.2s;
	 	 
	 	 &:hover {
	 	 	 	 transform: scale(1.1);
	 	 }
`;

const TextArea = styled.textarea`
	 width: 100%;
	 padding: 15px;
	 border: 2px solid #ffc0cb;
	 border-radius: 10px;
	 font-size: 1rem;
	 resize: vertical;
	 min-height: 200px;
	 transition: border-color 0.3s;

	 &:focus {
	 	 border-color: #ff69b4;
	 	 outline: none;
	 	 box-shadow: 0 0 5px rgba(255, 105, 180, 0.5);
	 }
`;

const Input = styled.input`
	 width: 100%;
	 padding: 12px;
	 border: 2px solid #ffc0cb; 
	 border-radius: 8px;
	 font-size: 1rem;
	 transition: border-color 0.3s;

	 &:focus {
	 	 border-color: #ff69b4;
	 	 outline: none;
	 }
`;

const SubmitButton = styled.button`
	 background-color: #ff69b4;
	 color: white;
	 padding: 12px 25px;
	 border: none;
	 border-radius: 25px;
	 font-size: 1.1rem;
	 font-weight: bold;
	 cursor: pointer;
	 display: flex;
	 align-items: center;
	 justify-content: center;
	 gap: 10px;
	 transition: background-color 0.3s, transform 0.2s;
	 margin-top: 20px;

	 &:disabled {
	 	 background-color: #ffc0cb;
	 	 cursor: not-allowed;
	 }

	 &:hover:not(:disabled) {
	 	 background-color: #ff4081;
	 	 transform: translateY(-2px);
	 	 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	 }
`;

const StatusMessage = styled.div`
	 	 color: ${props => (props.$error ? '#ff4081' : '#ff69b4')};
	 	 background: ${props => (props.$error ? '#fce4ec' : '#e0ffff')};
	 	 padding: 15px;
	 	 border-radius: 8px;
	 	 margin-bottom: 20px;
	 	 text-align: center;
`;

// --- Component ---

const SubmitReview = () => {
	 // Use useParams to get the book ID from the URL (e.g., /submitreview/655...)
	 const { bookId } = useParams(); 
	 const navigate = useNavigate();
	 
	 const [rating, setRating] = useState(0);
	 const [reviewText, setReviewText] = useState('');
	 const [headline, setHeadline] = useState('');
	 const [bookTitle, setBookTitle] = useState('Loading...'); // Dynamic title
	 const [loading, setLoading] = useState(false);
	 const [error, setError] = useState(null);
	 
	 const userInfo = JSON.parse(localStorage.getItem('userInfo'));

	 // 1. Fetch book title to display it on the form
	 useEffect(() => {
	 	 if (!userInfo) {
	 	 	 	 navigate('/loginregister'); // Redirect if not logged in
	 	 	 	 return;
	 	 }
	 	 
	 	 const fetchTitle = async () => {
	 	 	 	 try {
	 	 	 	 	 	 const { data } = await axios.get(`http://localhost:5000/api/books/${bookId}`);
	 	 	 	 	 	 setBookTitle(data.title);
	 	 	 	 } catch (err) {
	 	 	 	 	 	 setBookTitle('Unknown Book');
	 	 	 	 	 	 setError("Could not load book title.");
	 	 	 	 }
	 	 };
	 	 
	 	 fetchTitle();
	 }, [bookId, userInfo, navigate]);


	 const handleRatingClick = (newRating) => {
	 	 setRating(newRating);
	 };

	 const handleSubmit = async (e) => {
	 	 e.preventDefault();
	 	 setLoading(true);
	 	 setError(null);

	 	 if (rating === 0) {
	 	 	 	 setError("Please select a star rating.");
	 	 	 	 setLoading(false);
	 	 	 	 return;
	 	 }
	 	 
	 	 try {
	 	 	 	 const config = {
	 	 	 	 	 	 headers: {
	 	 	 	 	 	 	 	 'Content-Type': 'application/json',
	 	 	 	 	 	 	 	 // Attach the JWT token for authentication
	 	 	 	 	 	 	 	 Authorization: `Bearer ${userInfo.token}`, 
	 	 	 	 	 	 },
	 	 	 	 };
	 	 	 	 
	 	 	 	 await axios.post(
	 	 	 	 	 	 `http://localhost:5000/api/reviews/${bookId}`, // Corrected: bookId in URL
	 	 	 	 	 	 { headline, text: reviewText, rating },        // Corrected: bookId removed from body
	 	 	 	 	 	 config
	 	 	 	 );
	 	 	 	 
	 	 	 	 // Success: Redirect back to the book details page
	 	 	 	 alert(`Review for "${bookTitle}" successfully posted!`);
	 	 	 	 navigate(`/books/${bookId}`);
	 	 	 	 
	 	 } catch (err) {
	 	 	 	 // Generic error message to prevent showing the old conflict text
	 	 	 	 setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
	 	 	 	 setLoading(false);
	 	 }
	 };

	 // Helper function to render star icons
	 const renderStars = () => {
	 	 const stars = [];
	 	 for (let i = 1; i <= 5; i++) {
	 	 	 	 stars.push(
	 	 	 	 	 	 <StarIcon 
	 	 	 	 	 	 	 	 key={i} 
	 	 	 	 	 	 	 	 onClick={() => handleRatingClick(i)}
	 	 	 	 	 	 	 	 style={{ color: i <= rating ? '#f7a400' : '#ffc0cb' }}
	 	 	 	 	 	 >
	 	 	 	 	 	 	 {i <= rating ? <FaStar /> : <FaRegStar />}
	 	 	 	 	 	 </StarIcon>
	 	 	 	 );
	 	 }
	 	 return stars;
	 };
	 
	 const isFormDisabled = loading || !userInfo;

	 return (
	 	 <ReviewSubmitContainer>
	 	 	 <FormWrapper>
	 	 	 	 <Header>
	 	 	 	 	 <Title>Submit Your Review</Title>
	 	 	 	 	 <Subtitle>
	 	 	 	 	 	 Sharing your thoughts on <BookHighlight>{bookTitle}</BookHighlight>
	 	 	 	 	 </Subtitle>
	 	 	 	 </Header>
	 	 	 	 
	 	 	 	 {error && <StatusMessage $error>{error}</StatusMessage>}
	 	 	 	 {!userInfo && <StatusMessage $error>You must be logged in to submit a review.</StatusMessage>}

	 	 	 	 <ReviewForm onSubmit={handleSubmit}>
	 	 	 	 	 
	 	 	 	 	 {/* --- Rating Input --- */}
	 	 	 	 	 <InputGroup>
	 	 	 	 	 	 <Label>Your Rating:</Label>
	 	 	 	 	 	 <RatingWrapper>
	 	 	 	 	 	 	 {renderStars()}
	 	 	 	 	 	 	 <span style={{ fontSize: '1.2rem', color: '#666', marginLeft: '10px' }}>
	 	 	 	 	 	 	 	 	 {rating > 0 ? `${rating} out of 5` : 'Select a rating'}
	 	 	 	 	 	 	 </span>
	 	 	 	 	 	 </RatingWrapper>
	 	 	 	 	 </InputGroup>

	 	 	 	 	 {/* --- Headline Input --- */}
	 	 	 	 	 <InputGroup>
	 	 	 	 	 	 <Label htmlFor="headline">Review Headline:</Label>
	 	 	 	 	 	 <Input 
	 	 	 	 	 	 	 	 id="headline"
	 	 	 	 	 	 	 	 type="text" 
	 	 	 	 	 	 	 	 value={headline} 
	 	 	 	 	 	 	 	 onChange={(e) => setHeadline(e.target.value)} 
	 	 	 	 	 	 	 	 placeholder="What is the main takeaway of your review?" 
	 	 	 	 	 	 	 	 required
	 	 	 	 	 	 	 	 disabled={isFormDisabled}
	 	 	 	 	 	 />
	 	 	 	 	 </InputGroup>

	 	 	 	 	 {/* --- Review Body --- */}
	 	 	 	 	 <InputGroup>
	 	 	 	 	 	 <Label htmlFor="reviewBody">Your Full Review:</Label>
	 	 	 	 	 	 <TextArea 
	 	 	 	 	 	 	 	 id="reviewBody"
	 	 	 	 	 	 	 	 value={reviewText} 
	 	 	 	 	 	 	 	 onChange={(e) => setReviewText(e.target.value)} 
	 	 	 	 	 	 	 	 placeholder="Share your detailed thoughts..." 
	 	 	 	 	 	 	 	 required
	 	 	 	 	 	 	 	 disabled={isFormDisabled}
	 	 	 	 	 	 />
	 	 	 	 	 </InputGroup>

	 	 	 	 	 <SubmitButton type="submit" disabled={isFormDisabled}>
	 	 	 	 	 	 {loading ? <FaSpinner className="fa-spin" /> : <FaPaperPlane />} 
	 	 	 	 	 	 {loading ? 'Posting...' : 'Post Review'}
	 	 	 	 	 </SubmitButton>
	 	 	 	 </ReviewForm>
	 	 	 	 
	 	 	 </FormWrapper>
	 	 </ReviewSubmitContainer>
	 );
};

export default SubmitReview;