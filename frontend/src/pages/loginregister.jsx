import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaSpinner, FaBookReader } from 'react-icons/fa';
import axios from 'axios';

// --- Styled Components (omitted for brevity) ---
// ... (Your styled components remain here) ...
const AuthContainer = styled.div`
  min-height: 80vh;
  background-color: #fffafb;
  padding: 50px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const AuthWrapper = styled.div`
  max-width: 450px;
  width: 100%;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
  padding: 40px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  color: #ff69b4;
  font-family: 'Playfair Display', serif;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 5px;
`;

const ToggleButtonContainer = styled.div`
  display: flex;
  margin-bottom: 25px;
  border: 2px solid #ffc0cb;
  border-radius: 10px;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  background-color: ${props => (props.$active ? '#ff69b4' : '#fff')};
  color: ${props => (props.$active ? 'white' : '#ff69b4')};
  transition: all 0.3s;

  &:hover:not(:disabled):not(.$active) {
    background-color: #ffe8f0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
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

const Message = styled.div`
    color: ${props => (props.$error ? '#8B0000' : '#006400')};
    background: ${props => (props.$error ? '#fce4ec' : '#d4edda')};
    border: 1px solid ${props => (props.$error ? '#ff4081' : '#c3e6cb')};
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
    text-align: center;
    font-weight: 500;
`;
// --- End Styled Components ---


const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', error: false });

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: '', error: false });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', error: false });
    
    // Client-side validation
    if (!formData.email || !formData.password || (!isLogin && !formData.username)) {
        setMessage({ text: 'Please fill in all required fields.', error: true });
        setLoading(false);
        return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
        setMessage({ text: 'Passwords do not match.', error: true });
        setLoading(false);
        return;
    }
    
    // Payload preparation
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true, 
    };
    
    const url = isLogin 
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';

    try {
      const { data } = await axios.post(
        url,
        isLogin ? { email: formData.email, password: formData.password } : { username: formData.username, email: formData.email, password: formData.password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      
      setMessage({ text: `${isLogin ? 'Login' : 'Registration'} successful! Redirecting...`, error: false });
      
      // ✅ MODIFIED: Navigate to home ('/') and force a full page reload.
      setTimeout(() => {
        navigate('/'); // Navigate to the home page
        window.location.reload(); // Force the browser to reload
      }, 1000); 
      
    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      
      setMessage({ text: errorMessage, error: true });
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Header>
          <Title><FaBookReader size="0.9em" style={{marginRight: '10px'}}/>Welcome</Title>
          <p>{isLogin ? 'Sign in to access your library' : 'Create an account to join The Archive'}</p>
        </Header>

        <ToggleButtonContainer>
          <ToggleButton 
            $active={isLogin} 
            onClick={() => { setIsLogin(true); setMessage({ text: '', error: false }); }}
          >
            Login
          </ToggleButton>
          <ToggleButton 
            $active={!isLogin} 
            onClick={() => { setIsLogin(false); setMessage({ text: '', error: false }); }}
          >
            Register
          </ToggleButton>
        </ToggleButtonContainer>
        
        <Form onSubmit={handleAuth}>
          {!isLogin && (
            <InputGroup>
              <Label htmlFor="username">Username</Label>
              <Input 
                type="text" 
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
              />
            </InputGroup>
          )}

          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </InputGroup>

          {!isLogin && (
            <InputGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                type="password" 
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
              />
            </InputGroup>
          )}
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? <FaSpinner className="fa-spin" /> : (isLogin ? <FaSignInAlt /> : <FaUserPlus />)}
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </SubmitButton>
          
          {message.text && <Message $error={message.error}>{message.text}</Message>}
        </Form>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default LoginRegister;