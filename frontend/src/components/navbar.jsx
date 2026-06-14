import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookOpen, FaFeatherAlt, FaUser, FaSignOutAlt, FaShieldAlt, FaBars, FaTimes } from 'react-icons/fa';

// --- Styled Components (UNCHANGED) ---

const Nav = styled.nav`
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.1);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoText = styled.h1`
  font-size: 1.8rem;
  color: #ff69b4;
  margin-left: 10px;
  font-family: 'Playfair Display', serif;
  letter-spacing: 1px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 15px;
  padding: 5px 0;
  transition: color 0.3s, border-bottom 0.3s;
  border-bottom: 2px solid transparent;

  &:hover {
    color: #ff69b4;
    border-bottom: 2px solid #ff69b4;
  }
  
  &.active {
    color: #ff4081;
    border-bottom: 2px solid #ff4081;
  }
`;

const AuthButton = styled(Link)`
  background-color: #ffc0cb;
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  padding: 8px 18px;
  border-radius: 20px;
  margin-left: 20px;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #ff69b4;
    color: white;
    transform: translateY(-1px);
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  gap: 15px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const UserMenuItem = styled(Link)`
  color: ${props => (props.$primary ? '#ff69b4' : '#333')};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #ff4081;
  }
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ff69b4;

  @media (max-width: 900px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 70px; /* Adjust based on navbar height */
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 8px 15px rgba(255, 105, 180, 0.1);
  padding: 20px 30px;
  transform: translateY(${props => (props.$isOpen ? '0' : '-150%')});
  transition: transform 0.4s ease-in-out;
  z-index: 999;
  align-items: flex-start;

  ${NavItem}, ${AuthButton}, ${UserMenuItem} {
    margin: 10px 0;
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid #fce4ec;
  }
`;


// --- Component (Functional) ---

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Check local storage for user info on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user info from localStorage", e);
      setUserInfo(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setIsMobileMenuOpen(false); // Close menu on logout
    navigate('/'); // Redirect to home page
    window.location.reload(); // Force refresh to update components
  };

  const NavLinksContent = () => (
    <>
      <NavItem to="/" onClick={() => setIsMobileMenuOpen(false)}>
        Home
      </NavItem>
      <NavItem to="/books" onClick={() => setIsMobileMenuOpen(false)}>
        Books
      </NavItem>
      {/* 🛑 FIX: Changed to match App.jsx path="/trending" */}
      <NavItem to="/trending" onClick={() => setIsMobileMenuOpen(false)}> 
        Trending Reviews
      </NavItem>
      {/* 🛑 FIX: Changed to match App.jsx path="/about" */}
      <NavItem to="/about" onClick={() => setIsMobileMenuOpen(false)}> 
        About Us
      </NavItem>
      {/* 🛑 FIX: Changed to match App.jsx path="/contact" */}
      <NavItem to="/contact" onClick={() => setIsMobileMenuOpen(false)}> 
        Contact
      </NavItem>
    </>
  );

  const AuthLinksContent = () => {
    if (userInfo) {
      // Logged In State
      return (
        <UserMenu>
          {userInfo.isAdmin && (
            <UserMenuItem to="/admin" $primary onClick={() => setIsMobileMenuOpen(false)}>
              <FaShieldAlt /> Admin
            </UserMenuItem>
          )}
          <UserMenuItem to={`/profile/${userInfo._id}`} onClick={() => setIsMobileMenuOpen(false)}>
            <FaUser /> Profile
          </UserMenuItem>
          <UserMenuItem as="div" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <FaSignOutAlt /> Logout
          </UserMenuItem>
        </UserMenu>
      );
    } else {
      // Logged Out State
      return (
        // 🛑 FIX: Changed to match App.jsx path="/auth"
        <AuthButton to="/auth" onClick={() => setIsMobileMenuOpen(false)}> 
          <FaUser /> Login/Register
        </AuthButton>
      );
    }
  };

  return (
    <Nav>
      <LogoLink to="/">
        <FaBookOpen color="#ff69b4" size="2rem" />
        <LogoText>Archive <FaFeatherAlt size="0.8em" style={{ marginLeft: '5px' }} /></LogoText>
      </LogoLink>

      {/* Desktop Navigation */}
      <NavLinks>
        <NavLinksContent />
        {AuthLinksContent()}
      </NavLinks>

      {/* Mobile Menu Toggle */}
      <Hamburger onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </Hamburger>

      {/* Mobile Menu Content */}
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <NavLinksContent />
        {/* We flatten the Auth/User links for mobile */}
        {userInfo ? (
          <>
            {userInfo.isAdmin && (
              <UserMenuItem to="/admin" $primary onClick={() => setIsMobileMenuOpen(false)}>
                <FaShieldAlt /> Admin Area
              </UserMenuItem>
            )}
            <UserMenuItem to={`/profile/${userInfo._id}`} onClick={() => setIsMobileMenuOpen(false)}>
              <FaUser /> My Profile
            </UserMenuItem>
            <UserMenuItem as="div" onClick={handleLogout} style={{ cursor: 'pointer', color: '#ff4081' }}>
              <FaSignOutAlt /> Logout
            </UserMenuItem>
          </>
        ) : (
          // 🛑 FIX: Changed to match App.jsx path="/auth"
          <AuthButton to="/auth" onClick={() => setIsMobileMenuOpen(false)}> 
            <FaUser /> Login/Register
          </AuthButton>
        )}
      </MobileMenu>
    </Nav>
  );
};

export default Navbar;