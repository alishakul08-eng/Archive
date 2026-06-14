import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaRegStar, FaSpinner, FaBookReader } from 'react-icons/fa';
import axios from 'axios';

// --- Styled Components (omitted for brevity) ---
// ... (Your styled components remain unchanged) ...

const ListContainer = styled.div`
  min-height: 80vh;
  background-color: #fffafb; 
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #ff69b4;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 30px auto;
  padding: 10px 20px;
  background: white;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.1);
  border: 1px solid #ffc0cb;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  font-size: 1rem;
  padding: 5px 10px;
  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: #ff69b4;
  margin-right: 10px;
`;

const BookGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  padding-top: 20px;
`;

const BookCard = styled(Link)`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  text-decoration: none;
  color: #333;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.2);
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 1px solid #fce4ec;
`;

const CardContent = styled.div`
  padding: 15px;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;
  color: #ff69b4;
  margin-bottom: 5px;
  font-family: 'Playfair Display', serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardAuthor = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
`;

const CardRating = styled.div`
  color: #f7a400; // Gold/Yellow
  font-size: 1rem;
`;

const CardStars = styled.span`
  margin-right: 5px;
`;

// Utility Components for Loading/Error states
const StatusMessage = styled.div`
    font-size: 1.5rem;
    color: ${props => (props.$error ? '#ff4081' : '#ff69b4')};
    padding: 50px;
    display: flex;
    align-items: center;
    gap: 15px;
`;

// --- Helper Functions ---

const renderStars = (rating) => {
  const finalRating = rating || 0; // Use 0 if rating is null/undefined
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

// --- Component ---

const BookListings = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Data Fetching (runs once on component mount)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        // GET request to your backend API endpoint
        const { data } = await axios.get('http://localhost:5000/api/books');
        setBooks(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load books. Please check the backend server.');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchBooks();
  }, []); 

  // 2. Filtering Logic
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 3. Render States
  if (loading) {
    return (
        <ListContainer>
            <StatusMessage>
                <FaSpinner className="fa-spin" /> Loading Books...
            </StatusMessage>
        </ListContainer>
    );
  }

  if (error) {
    return (
        <ListContainer>
            <StatusMessage $error>
                {error}
            </StatusMessage>
        </ListContainer>
    );
  }

  return (
    <ListContainer>
      <Header>
        <Title>The Archive Collection</Title>
        <Subtitle>Explore community-reviewed titles submitted by our users.</Subtitle>
        
        <SearchBar>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
      </Header>

      <BookGrid>
        {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
            <BookCard key={book._id} to={`/books/${book._id}`}>
              <CoverImage 
                src={book.coverImage || 'https://via.placeholder.com/250x300/ffc0cb/ffffff?text=No+Cover'} 
                alt={`Cover of ${book.title}`} 
              />
              <CardContent>
                <CardTitle>{book.title}</CardTitle>
                <CardAuthor>By {book.author}</CardAuthor>
                <CardRating>
                  {/* FIX 1: Pass the rating through optional chaining to prevent crash */}
                  <CardStars>{renderStars(book.averageRating)}</CardStars>
                  
                  {/* FIX 2: Use optional chaining to prevent the .toFixed() crash */}
                  ({book.averageRating?.toFixed(1) || 'N/A'})
                </CardRating>
              </CardContent>
            </BookCard>
            ))
        ) : (
             <StatusMessage style={{gridColumn: '1 / -1'}}>
                 <FaBookReader /> 
                 {searchTerm ? `No books found matching "${searchTerm}"` : 'No books have been added yet.'}
             </StatusMessage>
        )}
      </BookGrid>
    </ListContainer>
  );
};

export default BookListings;