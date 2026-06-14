// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component Imports - Uses lowercase filenames as requested
import Navbar from './components/navbar.jsx'; 

// Page Imports (All 10 pages) - Uses lowercase filenames as requested
import Home from './pages/home.jsx';
import BookListings from './pages/booklistings.jsx';
import BookDetails from './pages/bookdetails.jsx';
import LoginRegister from './pages/loginregister.jsx';
import UserProfile from './pages/userprofile.jsx';
import SubmitReview from './pages/submitreview.jsx';
import AboutUs from './pages/aboutus.jsx';
import ContactUs from './pages/contactus.jsx';
import TrendingReviews from './pages/trendingreviews.jsx';
import AdminArea from './pages/adminarea.jsx';


function App() {
  return (
    <Router>
      {/* Navbar will appear on all pages */}
      <Navbar /> 
      
      {/* Main content container for responsive design */}
      <div className="pt-16 pb-8 min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookListings />} />
          
          {/* 🚨 FIX APPLIED HERE: Changed from "/book/:id" to match the link: "/books/:id" */}
          <Route path="/books/:id" element={<BookDetails />} /> 
          
          <Route path="/trending" element={<TrendingReviews />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/auth" element={<LoginRegister />} />

          {/* User/Authenticated Routes */}
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/review/:bookId" element={<SubmitReview />} />

          {/* Admin Route (Protected in the backend) */}
          <Route path="/admin" element={<AdminArea />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;