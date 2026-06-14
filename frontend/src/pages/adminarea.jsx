import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaBookMedical, FaSpinner, FaShieldAlt, FaSave, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

// --- Styled Components (UNCHANGED) ---

const AdminContainer = styled.div`
  min-height: 80vh;
  background-color: #fffafb;
  padding: 50px 20px;
  display: flex;
  justify-content: center;
`;

const AdminWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
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

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
  grid-column: ${props => (props.$fullwidth ? '1 / -1' : 'auto')};
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  color: #333;
  margin-bottom: 5px;
  font-weight: 600;
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
    box-shadow: 0 0 5px rgba(255, 105, 180, 0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #ffc0cb; 
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 150px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #ff69b4;
    outline: none;
    box-shadow: 0 0 5px rgba(255, 105, 180, 0.5);
  }
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1;
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
    grid-column: 1 / -1;
    color: ${props => (props.$error ? '#8B0000' : '#006400')};
    background: ${props => (props.$error ? '#fce4ec' : '#d4edda')};
    border: 1px solid ${props => (props.$error ? '#ff4081' : '#c3e6cb')};
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 500;
`;

const UnauthorizedMessage = styled.div`
    text-align: center;
    padding: 50px;
    color: #ff4081;
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
`;


// --- Component ---

const AdminArea = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', error: false });
  
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '', // Input as comma-separated string
    publicationYear: '',
    description: '',
    coverImage: '',
  });

  // 1. Authorization Check
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo(user);
      
      // If user is NOT admin, redirect them out
      if (!user.isAdmin) {
        navigate('/'); 
      }
    } else {
      // If no user, redirect to login
      navigate('/loginregister');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
    // Clear status on input
    setStatus({ message: '', error: false }); 
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', error: false });

    // Client-side validation
    if (!bookData.title || !bookData.author || !bookData.isbn || !bookData.publicationYear || !bookData.description) {
        setStatus({ message: 'Please fill in all required fields.', error: true });
        setLoading(false);
        return;
    }

    try {
        const payload = {
            ...bookData,
            // Convert comma-separated genre string into an array of strings for Mongoose
            genre: bookData.genre.split(',').map(g => g.trim()).filter(g => g.length > 0),
            // Ensure year is a number
            publicationYear: parseInt(bookData.publicationYear),
        };
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // Crucial: Attach the JWT token for the 'protect' and 'admin' middleware checks
                Authorization: `Bearer ${userInfo.token}`, 
            },
        };
        
        const { data } = await axios.post(
            'http://localhost:5000/api/books', // POST to book creation endpoint
            payload,
            config
        );
        
        setStatus({ message: `Book "${data.title}" added successfully!`, error: false });
        
        // Reset form for next entry
        setBookData({
            title: '', author: '', isbn: '', genre: '', 
            publicationYear: '', description: '', coverImage: '',
        });
        
    } catch (err) {
        // Handle specific backend errors (e.g., duplicate ISBN)
        const errorMessage = err.response?.data?.message || 'Book submission failed. Check server logs.';
        setStatus({ message: errorMessage, error: true });
    } finally {
        setLoading(false);
    }
  };


  // Render unauthorized message if admin status check hasn't passed or is false
  if (!userInfo || !userInfo.isAdmin) {
    return (
        <AdminContainer>
            <UnauthorizedMessage>
                <FaExclamationTriangle size="3rem" />
                Access Denied. You must be an administrator to view this page.
            </UnauthorizedMessage>
        </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminWrapper>
        <Header>
          <Title><FaShieldAlt size="0.9em" style={{marginRight: '10px'}}/>Admin Area</Title>
          <Subtitle>Add new book data to the database.</Subtitle>
        </Header>
        
        {status.message && <StatusMessage $error={status.error}>{status.message}</StatusMessage>}

        <Form onSubmit={handleSubmit}>
          
          <InputGroup>
            <Label htmlFor="title">Title *</Label>
            <Input 
                type="text" 
                id="title"
                name="title"
                value={bookData.title}
                onChange={handleChange}
                required
                disabled={loading}
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="author">Author *</Label>
            <Input 
                type="text" 
                id="author"
                name="author"
                value={bookData.author}
                onChange={handleChange}
                required
                disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="isbn">ISBN *</Label>
            <Input 
                type="text" 
                id="isbn"
                name="isbn"
                value={bookData.isbn}
                onChange={handleChange}
                required
                disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="publicationYear">Publication Year *</Label>
            <Input 
                type="number" 
                id="publicationYear"
                name="publicationYear"
                value={bookData.publicationYear}
                onChange={handleChange}
                required
                disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="genre">Genre (Comma-separated, e.g., Fiction, Mystery)</Label>
            <Input 
                type="text" 
                id="genre"
                name="genre"
                value={bookData.genre}
                onChange={handleChange}
                disabled={loading}
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input 
                type="text" 
                id="coverImage"
                name="coverImage"
                value={bookData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg (Optional)"
                disabled={loading}
            />
          </InputGroup>
          
          <InputGroup $fullwidth>
            <Label htmlFor="description">Description *</Label>
            <TextArea 
                id="description"
                name="description"
                value={bookData.description}
                onChange={handleChange}
                required
                disabled={loading}
            />
          </InputGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? <FaSpinner className="fa-spin" /> : <FaSave />} 
            {loading ? 'Submitting Book...' : 'Add New Book'}
          </SubmitButton>
        </Form>
        
      </AdminWrapper>
    </AdminContainer>
  );
};

export default AdminArea;