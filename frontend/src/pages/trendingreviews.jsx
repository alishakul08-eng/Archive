import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBookOpen, FaStar, FaRegStar, FaFrownOpen, FaSpinner, FaUserCircle } from 'react-icons/fa';
import axios from 'axios'; // <-- UNCOMMENTED
import { Link } from 'react-router-dom'; // <-- ADDED for book links

// --- Styled Components (Minimal) ---
const TrendingContainer = styled.div`
  min-height: 80vh;
  padding: 50px 20px;
  background-color: #f7f7f7;
`;

const Header = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  color: #ff69b4;
  margin-bottom: 40px;
  font-family: 'Playfair Display', serif;
`;

const NoReviewsCard = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #555;
`;

const Icon = styled.div`
  color: #ff69b4;
  font-size: 3rem;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ReviewCard = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.1);
    border-left: 5px solid #ffc0cb;
    
    &:hover {
        border-left-color: #ff69b4;
    }
`;

const ReviewHeadline = styled.h4`
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 8px;
`;

const ReviewText = styled.p`
    color: #555;
    font-style: italic;
    margin-bottom: 15px;
    max-height: 80px;
    overflow: hidden;
    line-height: 1.4;
`;

const ReviewMeta = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    color: #777;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #eee;

    a {
        color: #ff69b4;
        font-weight: bold;
        text-decoration: none;
        margin-top: 5px;
        
        &:hover {
            text-decoration: underline;
        }
    }
`;

const StarRating = styled.div`
    color: #f7a400;
    font-size: 1.1rem;
    margin-bottom: 10px;
`;
// --- End Styled Components ---


// Helper function for stars
const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
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

const TrendingReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔑 Updated useEffect to fetch data from the new backend endpoint
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Hitting the new public route you created
        const response = await axios.get('http://localhost:5000/api/reviews'); 
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <NoReviewsCard>
        <Icon><FaSpinner className="fa-spin" /></Icon>
        <Message>Loading all community reviews...</Message>
      </NoReviewsCard>
    );
  }

  // --- Main Logic: Check if the array is empty ---
  if (reviews.length === 0) {
    return (
      <TrendingContainer>
        <Header>Trending Reviews <FaStar size="0.8em" /></Header>
        <NoReviewsCard>
          <Icon><FaFrownOpen /></Icon>
          <Message>No reviews found yet.</Message>
          <p>Be the first to submit a review and get the trend started!</p>
        </NoReviewsCard>
      </TrendingContainer>
    );
  }

  // Code to render the actual reviews
  return (
    <TrendingContainer>
      <Header>Community Reviews ({reviews.length}) <FaStar size="0.8em" /></Header>
      <ReviewGrid>
        {reviews.map(review => (
            <ReviewCard key={review._id}>
                <ReviewHeadline>{review.headline}</ReviewHeadline>
                <StarRating>{renderStars(review.rating)}</StarRating>
                <ReviewText>"{review.text}"</ReviewText>
                
                <ReviewMeta>
                    <div style={{color: '#333', display: 'flex', alignItems: 'center'}}>
                        <FaUserCircle style={{marginRight: '8px'}}/> Reviewed by: **{review.user?.username || 'Archived User'}**
                    </div>
                    {/* Link to the book details page */}
                    <Link to={`/books/${review.book?._id}`}>
                        <FaBookOpen style={{marginRight: '8px'}}/> Book: {review.book?.title || 'Unknown Book'}
                    </Link>
                </ReviewMeta>
            </ReviewCard>
        ))}
      </ReviewGrid>
    </TrendingContainer>
  );
};

export default TrendingReviews;