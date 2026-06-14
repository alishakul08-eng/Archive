const express = require('express');
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUser, 
} = require('../controllers/usercontroller'); // ⬅️ Ensure 'usercontroller' is lowercase

const { protect } = require('../middleware/auth'); 

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Private routes (for the logged-in user's profile)
// 🛑 No trailing comma after updateUserProfile!
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
    

// 🔑 CRITICAL: Private route to delete a user by ID
// This must be a separate route to fix the 404 issue.
router.route('/:id').delete(protect, deleteUser); 

module.exports = router;