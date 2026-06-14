// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db'); 
const { notFound, errorHandler } = require('./middleware/errormiddleware'); 

// --- Configuration ---
dotenv.config();
connectDB(); 
const app = express();

// --- Middleware ---
// 🔑 CORRECTION: Setting origin to 5173 to match your React app
app.use(cors({
  origin: 'http://localhost:5173', // <-- This MUST match your frontend's port
  credentials: true, // Crucial for sending the HTTP-only cookie
}));

app.use(express.json()); 
app.use(cookieParser());

// --- Routes ---
app.use('/api/auth', require('./routes/authroutes'));
app.use('/api/books', require('./routes/bookroutes')); 
app.use('/api/reviews', require('./routes/reviewroutes')); 

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(
    PORT,
    console.log(`Server running on port ${PORT}`)
);