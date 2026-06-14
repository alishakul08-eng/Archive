import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaFeatherAlt } from 'react-icons/fa';

// --- Styled Components ---

const HomeContainer = styled.section`
  // Full-screen height (minus header/footer if they were fixed height)
  min-height: 80vh; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #fffafb; // Very light, almost white pink/blush
  padding: 40px 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  color: #ff69b4; // Hot Pink
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif; // Use a nice, readable font
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: #333;
  max-width: 600px;
  margin-bottom: 30px;
  font-weight: 300;
`;

const CallToActionGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 60px;
`;

const CTAButton = styled(Link)`
  text-decoration: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  // Primary Button (Browse Books)
  background-color: ${props => (props.$primary ? '#ff69b4' : 'transparent')};
  color: ${props => (props.$primary ? 'white' : '#ff69b4')};
  border: 2px solid #ff69b4;

  &:hover {
    background-color: ${props => (props.$primary ? '#ff4081' : '#ffe4e6')}; // Darker pink on hover / Lighter pink background on hover
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureSection = styled.section`
  width: 100%;
  max-width: 1000px;
  margin-top: 40px;
  padding: 30px 0;
  border-top: 1px solid #f0f0f0;
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  color: #ff69b4;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
`;

const FeatureList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 30px;
`;

const FeatureCard = styled.div`
  background: white;
  border: 1px solid #fce4ec;
  border-radius: 15px;
  padding: 25px;
  width: 300px;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.1); // Soft pink shadow
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(255, 105, 180, 0.2);
  }
`;

const FeatureIcon = styled.div`
  color: #ff69b4;
  font-size: 2.5rem;
  margin-bottom: 15px;
`;

const FeatureHeading = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
`;

const FeatureText = styled.p`
  color: #666;
  font-size: 0.95rem;
`;

// --- Component ---

const Home = () => {
  return (
    <HomeContainer>
      <HeroTitle>
        Welcome to Archive
      </HeroTitle>
      <HeroSubtitle>
        Explore new and popular books, share opinions, and connect with other readers.
      </HeroSubtitle>
      
      <CallToActionGroup>
        <CTAButton to="/books" $primary>
          <FaBookOpen /> Browse Books
        </CTAButton>
        <CTAButton to="/trending">
          <FaFeatherAlt /> View Trending Reviews
        </CTAButton>
      </CallToActionGroup>

      <FeatureSection>
        <SectionTitle>
          Why Join Archive?
        </SectionTitle>
        <FeatureList>
          <FeatureCard>
            <FeatureIcon>📖</FeatureIcon>
            <FeatureHeading>Discover New Reads</FeatureHeading>
            <FeatureText>Find hidden gems and bestsellers based on community recommendations and personalized lists.</FeatureText>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>✍️</FeatureIcon>
            <FeatureHeading>Write and Share Reviews</FeatureHeading>
            <FeatureText>Express your thoughts with detailed reviews and ratings that influence the reading community.</FeatureText>
          </FeatureCard>
          
        </FeatureList>
      </FeatureSection>
    </HomeContainer>
  );
};

export default Home;
