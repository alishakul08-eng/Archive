import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaUserEdit, FaCommentDots, FaSpinner, FaUserCircle, FaSave, FaExclamationCircle } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa'; // Added FaCheckCircle import
import axios from 'axios';

// --- Styled Components (omitted for brevity) ---
const DetailContainer = styled.div`
	 min-height: 80vh;
	 background-color: #fffafb; 
	 padding: 50px 20px;
	 display: flex;
	 justify-content: center;
`;
const ContentWrapper = styled.div`
	 max-width: 1200px;
	 width: 100%;
	 display: flex;
	 flex-direction: column;
	 background: white;
	 border-radius: 15px;
	 box-shadow: 0 8px 25px rgba(255, 105, 180, 0.15);
	 padding: 40px;
`;

const BookHeader = styled.div`
	 display: flex;
	 gap: 40px;
	 margin-bottom: 40px;

	 @media (max-width: 768px) {
	 	 flex-direction: column;
	 	 align-items: center;
	 	 text-align: center;
	 }
`;

const CoverImage = styled.img`
	 width: 250px;
	 height: 350px;
	 border-radius: 10px;
	 object-fit: cover;
	 box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const BookInfo = styled.div`
	 flex-grow: 1;
`;

const Title = styled.h1`
	 font-size: 2.8rem;
	 color: #ff69b4;
	 margin-bottom: 5px;
	 font-family: 'Playfair Display', serif;
`;

const Author = styled.h2`
	 font-size: 1.5rem;
	 color: #333;
	 margin-bottom: 20px;
	 font-weight: 300;
`;

const MetaData = styled.p`
	 font-size: 1rem;
	 color: #666;
	 margin-bottom: 8px;
	 
	 strong {
	 	 color: #ff69b4;
	 }
`;

const RatingWrapper = styled.div`
	 display: flex;
	 align-items: center;
	 gap: 15px;
	 margin-top: 15px;
	 margin-bottom: 25px;
	 
	 @media (max-width: 768px) {
	 	 justify-content: center;
	 }
`;

const Stars = styled.div`
	 color: #f7a400; // Gold/Yellow for stars
	 font-size: 1.5rem;
`;

const ReviewCount = styled.span`
	 color: #ff69b4;
	 font-size: 1rem;
	 text-decoration: none;
`;

const Description = styled.p`
	 font-size: 1.1rem;
	 line-height: 1.6;
	 color: #444;
	 margin-bottom: 30px;
`;

const ActionButtons = styled.div`
	 display: flex;
	 gap: 20px;
	 
	 @media (max-width: 768px) {
	 	 justify-content: center;
	 }
`;

const ActionButton = styled(Link)`
	 text-decoration: none;
	 padding: 10px 20px;
	 border-radius: 25px;
	 font-weight: bold;
	 transition: all 0.3s ease;
	 display: flex;
	 align-items: center;
	 gap: 8px;

	 background-color: ${props => (props.$primary ? '#ff69b4' : '#ffc0cb')};
	 color: ${props => (props.$primary ? 'white' : '#333')};
	 border: ${props => (props.$primary ? 'none' : '2px solid #ff69b4')};

	 &:hover {
	 	 background-color: ${props => (props.$primary ? '#ff4081' : '#ff69b4')};
	 	 color: white;
	 	 transform: translateY(-2px);
	 	 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	 }
`;

const ReviewSection = styled.section`
	 margin-top: 40px;
	 padding-top: 20px;
	 border-top: 1px solid #fce4ec; 
`;

const SectionHeading = styled.h3`
	 font-size: 2rem;
	 color: #ff69b4;
	 margin-bottom: 20px;
	 border-left: 5px solid #ff69b4;
	 padding-left: 10px;
`;

// --- New Review List Styles ---
const ReviewList = styled.div`
	 display: flex;
	 flex-direction: column;
	 gap: 20px;
`;

const ReviewCard = styled.div`
	 background: #fffafb;
	 padding: 20px;
	 border-radius: 10px;
	 box-shadow: 0 2px 5px rgba(255, 105, 180, 0.1);
	 border-left: 4px solid #ffc0cb;
`;

const ReviewCardHeader = styled.div`
	 display: flex;
	 justify-content: space-between;
	 align-items: center;
	 margin-bottom: 10px;
	 padding-bottom: 5px;
	 border-bottom: 1px dashed #fce4ec;
`;

const ReviewerInfo = styled.div`
	 display: flex;
	 align-items: center;
	 gap: 10px;
	 font-weight: bold;
	 color: #ff69b4;
	 font-size: 0.95rem;
`;

const ReviewRating = styled.div`
	 color: #f7a400;
	 font-size: 1.1rem;
`;

const ReviewHeadline = styled.h4`
	 font-size: 1.3rem;
	 color: #333;
	 margin-bottom: 8px;
`;

const ReviewText = styled.p`
	 font-size: 1rem;
	 color: #444;
	 line-height: 1.4;
`;

// --- Review Form Styles ---
const ReviewFormWrapper = styled.div`
	 padding: 25px;
	 background-color: #fce4ec;
	 border-radius: 10px;
	 margin-bottom: 30px;
`;

const Form = styled.form`
	 display: flex;
	 flex-direction: column;
	 gap: 15px;
`;

const FormGroup = styled.div`
	 display: flex;
	 flex-direction: column;
`;

const Label = styled.label`
	 font-weight: bold;
	 margin-bottom: 5px;
	 color: #ff69b4;
`;

const Input = styled.input`
	 padding: 10px;
	 border: 1px solid #ffc0cb;
	 border-radius: 5px;
	 font-size: 1rem;
`;

const Textarea = styled.textarea`
	 padding: 10px;
	 border: 1px solid #ffc0cb;
	 border-radius: 5px;
	 font-size: 1rem;
	 min-height: 100px;
	 resize: vertical;
`;

const SubmitButton = styled.button`
	 background-color: #ff69b4;
	 color: white;
	 padding: 12px 25px;
	 border: none;
	 border-radius: 25px;
	 font-size: 1rem;
	 font-weight: bold;
	 cursor: pointer;
	 transition: background-color 0.3s, transform 0.2s;
	 display: flex;
	 align-items: center;
	 justify-content: center;
	 gap: 10px;

	 &:hover {
	 	 background-color: #ff4081;
	 	 transform: translateY(-2px);
	 }
`;

const StatusMessage = styled.div`
	 	 padding: 10px;
	 	 border-radius: 5px;
	 	 margin-top: 10px;
	 	 background-color: ${props => (props.$error ? '#fce4ec' : '#d4edda')};
	 	 color: ${props => (props.$error ? '#8B0000' : '#006400')};
	 	 border: 1px solid ${props => (props.$error ? '#ff4081' : '#c3e6cb')};
	 	 display: flex;
	 	 align-items: center;
	 	 gap: 10px;
`;


// --- Helper Functions and Status Components ---

const renderStars = (rating) => {
	 const finalRating = rating || 0; 
	 const fullStars = Math.floor(finalRating);
	 const stars = [];
	 for (let i = 0; i < 5; i++) {
	 	 if (i < fullStars) {
	 	 	 stars.push(<FaStar key={i} />);
	 	 } else {
	 	 	 stars.push(<FaRegStar key={i} />);
	 	 }
	 }
	 return stars;
};

const LoadingState = () => (
	 	 <DetailContainer>
	 	 	 <FaSpinner className="fa-spin" style={{ fontSize: '2rem', color: '#ff69b4' }} />
	 	 	 <p style={{ marginLeft: '15px', color: '#ff69b4' }}>Loading Book Details...</p>
	 	 </DetailContainer>
);

// --- Component ---

const BookDetails = () => {
	 const { id: bookId } = useParams();
	 const [book, setBook] = useState(null);
	 const [reviews, setReviews] = useState([]);
	 const [loading, setLoading] = useState(true);
	 const [error, setError] = useState(null);
	 
	 // State for the new review form
	 const [reviewFormData, setReviewFormData] = useState({ 
	 	 rating: 5, 
	 	 headline: '',
	 	 text: '' 
	 });
	 const [reviewStatus, setReviewStatus] = useState(null); // { message: string, error: boolean }
	 const [reviewSubmitting, setReviewSubmitting] = useState(false);

	 // Get user info to check if they are logged in
	 const userInfo = JSON.parse(localStorage.getItem('userInfo'));

	 const fetchBookData = async () => {
	 	 try {
	 	 	 setLoading(true);
	 	 	 setError(null);
	 	 	 
	 	 	 const bookResponse = await axios.get(`http://localhost:5000/api/books/${bookId}`);
	 	 	 const bookData = bookResponse.data;
	 	 	 
	 	 	 setBook(bookData);
	 	 	 setReviews(bookData.reviews || []); 

	 	 	 setLoading(false);
	 	 } catch (err) {
	 	 	 setError('Failed to load data. The book ID may be invalid or the backend is offline.');
	 	 	 setLoading(false);
	 	 	 console.error(err);
	 	 }
	 };

	 useEffect(() => {
	 	 fetchBookData();
	 }, [bookId]);

	 // Handler for Review Submission
	 const handleReviewSubmit = async (e) => {
	 	 e.preventDefault();
	 	 setReviewSubmitting(true);
	 	 setReviewStatus(null);

	 	 // Check if the user is trying to submit a review without being logged in
	 	 if (!userInfo) {
	 	 	 setReviewStatus({ message: "You must be logged in to submit a review.", error: true });
	 	 	 setReviewSubmitting(false);
	 	 	 return;
	 	 }

	 	 try {
	 	 	 const config = { 
	 	 	 	 headers: { 'Content-Type': 'application/json' }, 
	 	 	 	 withCredentials: true 
	 	 	 };
	 	 	 
	 	 	 // 🔑 CRITICAL FIX: Change port from 5173 to 5000 to target the backend server.
	 	 	 await axios.post(`http://localhost:5000/api/reviews/${bookId}`, reviewFormData, config);
	 	 	 
	 	 	 setReviewStatus({ message: "Review submitted successfully! Refreshing reviews...", error: false });
	 	 	 setReviewFormData({ rating: 5, headline: '', text: '' }); // Clear form

	 	 	 // Re-fetch book data to get the new review and updated rating
	 	 	 setTimeout(() => fetchBookData(), 1500); 

	 	 } catch (err) {
	 	 	 // The misleading error message is handled here
	 	 	 const message = err.response?.data?.message || 'Failed to submit review. You may have already reviewed this book.';
	 	 	 setReviewStatus({ message: message, error: true });
	 	 } finally {
	 	 	 setReviewSubmitting(false);
	 	 }
	 };


	 if (loading) {
	 	 return <LoadingState />;
	 }

	 if (error || !book) {
	 	 return (
	 	 	 	 <DetailContainer>
	 	 	 	 	 	 <ContentWrapper>
	 	 	 	 	 	 	 	 <Title>Error or Book Not Found</Title>
	 	 	 	 	 	 	 	 <p style={{color: '#ff4081'}}>{error || "The requested book details could not be found."}</p>
	 	 	 	 	 	 	 	 <Link to="/books" style={{marginTop: '20px', color: '#ff69b4'}}>Go back to Book Listings</Link>
	 	 	 	 	 	 </ContentWrapper>
	 	 	 	 </DetailContainer>
	 	 );
	 }
	 
	 const safeRating = book.averageRating || 0;
	 const displayRating = safeRating.toFixed(1);
	 const reviewCount = reviews.length; // Use the local state length for consistency
	 const displayGenre = Array.isArray(book.genre) ? book.genre.join(', ') : book.genre || 'N/A';
	 
	 return (
	 	 <DetailContainer>
	 	 	 <ContentWrapper>
	 	 	 	 <BookHeader>
	 	 	 	 	 <CoverImage 
	 	 	 	 	 	 // 🔑 UPDATED: Use a static placeholder image URL since the dynamic path is gone.
	 	 	 	 	 	 src={'https://via.placeholder.com/250x350/ff69b4/ffffff?text=NO+COVER'} 
	 	 	 	 	 	 alt={`Cover of ${book.title}`} 
	 	 	 	 	 />
	 	 	 	 	 <BookInfo>
	 	 	 	 	 	 <Title>{book.title}</Title>
	 	 	 	 	 	 <Author>By {book.author}</Author>
	 	 	 	 	 	 
	 	 	 	 	 	 <RatingWrapper>
	 	 	 	 	 	 	 <Stars>{renderStars(safeRating)}</Stars>
	 	 	 	 	 	 	 <MetaData>({displayRating} / 5.0)</MetaData>
	 	 	 	 	 	 	 <ReviewCount>
	 	 	 	 	 	 	 	 	 {reviewCount} Reviews
	 	 	 	 	 	 	 </ReviewCount>
	 	 	 	 	 	 </RatingWrapper>
	 	 	 	 	 	 
	 	 	 	 	 	 <MetaData>Genre(s): <strong>{displayGenre}</strong></MetaData>
	 	 	 	 	 	 <MetaData>Published: <strong>{book.publicationYear}</strong></MetaData>
	 	 	 	 	 	 <MetaData>ISBN: <strong>{book.isbn || 'N/A'}</strong></MetaData>
	 	 	 	 	 	 
	 	 	 	 	 	 <ActionButtons>
	 	 	 	 	 	 	 {/* The Discuss button was removed previously. No buttons here now. */}
	 	 	 	 	 	 </ActionButtons>
	 	 	 	 	 </BookInfo>
	 	 	 	 </BookHeader>
	 	 	 	 
	 	 	 	 <Description>{book.description}</Description>

	 	 	 	 <ReviewSection>
	 	 	 	 	 <SectionHeading><FaUserEdit style={{marginRight: '10px'}}/>Add Your Review</SectionHeading>
	 	 	 	 	 
	 	 	 	 	 {userInfo ? (
	 	 	 	 	 	 <ReviewFormWrapper>
	 	 	 	 	 	 	 <Form onSubmit={handleReviewSubmit}>
	 	 	 	 	 	 	 	 <FormGroup>
	 	 	 	 	 	 	 	 	 <Label htmlFor="rating">Rating (1-5):</Label>
	 	 	 	 	 	 	 	 	 <Input 
	 	 	 	 	 	 	 	 	 	 id="rating"
	 	 	 	 	 	 	 	 	 	 type="number" 
	 	 	 	 	 	 	 	 	 	 min="1" 
	 	 	 	 	 	 	 	 	 	 max="5" 
	 	 	 	 	 	 	 	 	 	 value={reviewFormData.rating} 
	 	 	 	 	 	 	 	 	 	 onChange={(e) => setReviewFormData({...reviewFormData, rating: Number(e.target.value)})} 
	 	 	 	 	 	 	 	 	 	 required 
	 	 	 	 	 	 	 	 	 />
	 	 	 	 	 	 	 	 </FormGroup>
	 	 	 	 	 	 	 	 <FormGroup>
	 	 	 	 	 	 	 	 	 <Label htmlFor="headline">Review Headline:</Label>
	 	 	 	 	 	 	 	 	 <Input 
	 	 	 	 	 	 	 	 	 	 id="headline"
	 	 	 	 	 	 	 	 	 	 type="text" 
	 	 	 	 	 	 	 	 	 	 value={reviewFormData.headline} 
	 	 	 	 	 	 	 	 	 	 onChange={(e) => setReviewFormData({...reviewFormData, headline: e.target.value})} 
	 	 	 	 	 	 	 	 	 	 required 
	 	 	 	 	 	 	 	 	 />
	 	 	 	 	 	 	 	 </FormGroup>
	 	 	 	 	 	 	 	 <FormGroup>
	 	 	 	 	 	 	 	 	 <Label htmlFor="text">Full Review:</Label>
	 	 	 	 	 	 	 	 	 <Textarea 
	 	 	 	 	 	 	 	 	 	 id="text"
	 	 	 	 	 	 	 	 	 	 value={reviewFormData.text} 
	 	 	 	 	 	 	 	 	 	 onChange={(e) => setReviewFormData({...reviewFormData, text: e.target.value})} 
	 	 	 	 	 	 	 	 	 	 required 
	 	 	 	 	 	 	 	 	 />
	 	 	 	 	 	 	 	 </FormGroup>
	 	 	 	 	 	 	 	 <SubmitButton type="submit" disabled={reviewSubmitting}>
	 	 	 	 	 	 	 	 	 {reviewSubmitting ? <FaSpinner className="fa-spin" /> : <FaSave />}
	 	 	 	 	 	 	 	 	 {reviewSubmitting ? 'Submitting...' : 'Post Review'}
	 	 	 	 	 	 	 	 </SubmitButton>
	 	 	 	 	 	 	 </Form>
	 	 	 	 	 	 	 {reviewStatus && (
	 	 	 	 	 	 	 	 <StatusMessage $error={reviewStatus.error}>
	 	 	 	 	 	 	 	 	 {reviewStatus.error ? <FaExclamationCircle /> : <FaCheckCircle />}
	 	 	 	 	 	 	 	 	 {reviewStatus.message}
	 	 	 	 	 	 	 	 </StatusMessage>
	 	 	 	 	 	 	 )}
	 	 	 	 	 	 </ReviewFormWrapper>
	 	 	 	 	 ) : (
	 	 	 	 	 	 <p style={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
	 	 	 	 	 	 	 <FaExclamationCircle style={{marginRight: '8px', color: '#ff69b4'}}/>
	 	 	 	 	 	 	 Please <Link to="/auth" style={{color: '#ff69b4', fontWeight: 'bold'}}>log in</Link> to write a review.
	 	 	 	 	 	 </p>
	 	 	 	 	 )}

	 	 	 	 	 {/* --- Existing Reviews Section --- */}
	 	 	 	 	 <SectionHeading>Community Reviews ({reviewCount})</SectionHeading>
	 	 	 	 	 
	 	 	 	 	 <ReviewList>
	 	 	 	 	 	 {reviewCount > 0 ? (
	 	 	 	 	 	 	 	 reviews.map((review) => (
	 	 	 	 	 	 	 	 	 	 <ReviewCard key={review._id}>
	 	 	 	 	 	 	 	 	 	 	 	 <ReviewCardHeader>
	 	 	 	 	 	 	 	 	 	 	 	 	 	 <ReviewerInfo>
	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 <FaUserCircle /> {review.user?.username || 'Archived User'}
	 	 	 	 	 	 	 	 	 	 	 	 	 	 </ReviewerInfo>
	 	 	 	 	 	 	 	 	 	 	 	 	 	 <ReviewRating>
	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 {renderStars(review.rating)}
	 	 	 	 	 	 	 	 	 	 	 	 	 	 </ReviewRating>
	 	 	 	 	 	 	 	 	 	 	 	 </ReviewCardHeader>
	 	 	 	 	 	 	 	 	 	 	 	 <ReviewHeadline>{review.headline}</ReviewHeadline>
	 	 	 	 	 	 	 	 	 	 	 	 <ReviewText>{review.text}</ReviewText>
	 	 	 	 	 	 	 	 	 	 </ReviewCard>
	 	 	 	 	 	 	 	 ))
	 	 	 	 	 	 ) : (
	 	 	 	 	 	 	 	 <p style={{color: '#999'}}>Be the first to review **{book.title}**!</p>
	 	 	 	 	 	 )}
	 	 	 	 	 </ReviewList>
	 	 	 	 </ReviewSection>
	 	 	 	 
	 	 	 </ContentWrapper>
	 	 </DetailContainer>
	 );
};

export default BookDetails;