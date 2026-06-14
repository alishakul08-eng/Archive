import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaFeatherAlt, FaShieldAlt, FaSignOutAlt, FaBookMedical, FaSave, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Styled Components (Retained for completeness) ---

const ProfileContainer = styled.div`
  min-height: 80vh;
  padding: 50px 20px;
  background-color: #fffafb;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileCard = styled.div`
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
  padding: 40px;
  text-align: center;
  margin-bottom: 40px;
`;

const Avatar = styled.div`
  color: #ff69b4;
  font-size: 5rem;
  margin-bottom: 15px;
`;

const Greeting = styled.h1`
  font-size: 2.5rem;
  color: #ff69b4;
  margin-bottom: 5px;
  font-family: 'Playfair Display', serif;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
`;

const InfoBox = styled.div`
  background-color: #fce4ec;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 25px;
  text-align: left;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1rem;
  color: #333;

  svg {
    margin-right: 10px;
    color: #ff69b4;
    font-size: 1.2rem;
  }

  strong {
    font-weight: 600;
    margin-right: 5px;
  }
`;

const LogoutButton = styled.button`
  background-color: #ff4081;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #d4004e;
    transform: translateY(-2px);
  }
`;

const SubmitBookToggle = styled.button`
  background-color: ${props => (props.$active ? '#ff69b4' : '#ffc0cb')};
  color: ${props => (props.$active ? 'white' : '#333')};
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;

  &:hover {
    background-color: ${props => (props.$active ? '#ff4081' : '#ffc0cb')};
    color: ${props => (props.$active ? 'white' : '#111')};
  }
`;


// --- Book Submission Form Styles ---

const SubmissionWrapper = styled.div`
  max-width: 700px;
  width: 100%;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
`;

const FormHeader = styled.h2`
  font-size: 2rem;
  color: #ff69b4;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
  text-align: center;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  ${props => props.$fullwidth && 'grid-column: 1 / 3;'}
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 5px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ffc0cb;
  border-radius: 8px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #ffc0cb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const SubmitFormButton = styled.button`
  grid-column: 1 / 3;
  background-color: #ff69b4;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
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

const Message = styled.div`
  grid-column: 1 / 3;
  padding: 15px;
  border-radius: 8px;
  background-color: ${props => (props.$error ? '#fce4ec' : '#d4edda')};
  color: ${props => (props.$error ? '#8B0000' : '#006400')};
  display: flex;
  align-items: center;
  gap: 10px;
`;


// --- UserProfile Component ---

const UserProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publicationYear: '',
    description: '',
  });
  const [message, setMessage] = useState(null);

  // 1. Authentication Check & Load User Info (FIX APPLIED HERE)
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) {
      navigate('/auth'); 
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      
      // ✅ FIX: Check for required keys to prevent crash during render
      if (!parsedUser || !parsedUser.username || !parsedUser.email) {
          console.error("User info missing required fields, redirecting.");
          localStorage.removeItem('userInfo');
          navigate('/auth');
          return;
      }
      setUserInfo(parsedUser);

    } catch (e) {
      console.error("Failed to parse user info:", e);
      localStorage.removeItem('userInfo');
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
        await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
        console.warn("Backend logout failed:", error);
    }
    
    localStorage.removeItem('userInfo');
    navigate('/');
    window.location.reload(); 
  };

  // --- Submission Form Handlers ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    try {
        const config = {
            headers: { 
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
        
        const { data } = await axios.post('http://localhost:5000/api/books', formData, config);

        setMessage({ 
            text: `Success! Book "${data.title}" submitted. It now appears in the Books list.`, 
            error: false 
        });
        
        setFormData({ title: '', author: '', genre: '', publicationYear: '', description: '' });

    } catch (error) {
        const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : 'Submission failed. Please ensure backend server is running.';
            
        setMessage({ text: errorMessage, error: true });
    }
  };

  // ✅ FIX: Strong check before returning complex JSX
  if (!userInfo || !userInfo.username) {
    return <ProfileContainer>Loading...</ProfileContainer>; 
  }
  
  const role = userInfo.isAdmin ? 'Administrator' : 'Standard Reader';

  return (
    <ProfileContainer>
      
      {/* --- Profile Information Card --- */}
      <ProfileCard>
        <Avatar><FaUser /></Avatar>
        <Greeting>Hello, {userInfo.username}!</Greeting>
        <Subtitle>Welcome to your personal archive dashboard.</Subtitle>

        <InfoBox>
          <InfoItem>
            <FaFeatherAlt /> <strong>Username:</strong> {userInfo.username}
          </InfoItem>
          <InfoItem>
            <FaEnvelope /> <strong>Email:</strong> {userInfo.email}
          </InfoItem>
          <InfoItem>
            <FaShieldAlt /> <strong>Role:</strong> {role}
          </InfoItem>
        </InfoBox>

        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Log Out
        </LogoutButton>
      </ProfileCard>
      
      {/* --- Book Submission Toggle --- */}
      <SubmitBookToggle 
        $active={showSubmissionForm} 
        onClick={() => setShowSubmissionForm(!showSubmissionForm)}
      >
        <FaBookMedical /> {showSubmissionForm ? 'Hide Submission Form' : 'Submit a New Book'}
      </SubmitBookToggle>

      {/* --- Book Submission Form (Visible only when toggled) --- */}
      {showSubmissionForm && (
        <SubmissionWrapper>
          <FormHeader>New Book Submission</FormHeader>
          <Subtitle>Add details for a book not yet in our database.</Subtitle>
          
          <Form onSubmit={handleSubmit}>
            <InputGroup $fullwidth>
              <Label htmlFor="title">Title</Label>
              <Input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="author">Author</Label>
              <Input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="genre">Genre</Label>
              <Input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} required />
            </InputGroup>
            
            <InputGroup> 
              <Label htmlFor="publicationYear">Publication Year (YYYY)</Label>
              <Input 
                type="number" 
                id="publicationYear" 
                name="publicationYear" 
                value={formData.publicationYear} 
                onChange={handleChange} 
                required 
                min="1000" 
                max="2099" 
                placeholder="e.g., 2024"
              />
            </InputGroup>
            
            <InputGroup $fullwidth>
              <Label htmlFor="description">Description/Summary</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
            </InputGroup>
            
            <SubmitFormButton type="submit">
              <FaSave /> Submit Book
            </SubmitFormButton>
            
            {message && (
              <Message $error={message.error}>
                {message.error ? <FaExclamationCircle /> : <FaBookMedical />}
                {message.text}
              </Message>
            )}
          </Form>
        </SubmissionWrapper>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;