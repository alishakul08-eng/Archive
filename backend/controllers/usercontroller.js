    // backend/controllers/usercontroller.js

    const asyncHandler = require('express-async-handler');
    const User = require('../models/user'); 
    const Review = require('../models/review'); // ⬅️ CRITICAL: Imported for data cleanup
    const generateToken = require('../utils/generatetokens'); 

    // @desc 	 	 	 	Register a new user
    // @route 	 	POST /api/auth/register
    // @access 	Public
    const registerUser = asyncHandler(async (req, res) => {
                        const { username, email, password } = req.body;
                        const userExists = await User.findOne({ email });

                        if (userExists) {
                                        res.status(400);
                                        throw new Error('User already exists');
                        }

                        const user = await User.create({ username, email, password });

                        if (user) {
                                        generateToken(res, user._id); 
                                        res.status(201).json({
                                                        _id: user._id,
                                                        username: user.username,
                                                        email: user.email,
                                                        isAdmin: user.isAdmin,
                                        });
                        } else {
                                        res.status(400);
                                        throw new Error('Invalid user data');
                        }
    });

    // @desc 	 	 	 	Auth user & get token (Login)
    // @route 	 	POST /api/auth/login
    // @access 	Public
    const loginUser = asyncHandler(async (req, res) => {
                        const { email, password } = req.body;
                        const user = await User.findOne({ email });

                        if (user && (await user.matchPassword(password))) {
                                        generateToken(res, user._id); 
                                        res.json({
                                                        _id: user._id,
                                                        username: user.username,
                                                        email: user.email,
                                                        isAdmin: user.isAdmin,
                                        });
                        } else {
                                        res.status(401);
                                        throw new Error('Invalid email or password');
                        }
    });

    // @desc 	 	 	 	Logout user / clear cookie
    // @route 	 	POST /api/auth/logout
    // @access 	Public
    const logoutUser = asyncHandler(async (req, res) => {
                        res.cookie('jwt', '', {
                                        httpOnly: true,
                                        expires: new Date(0), // Clears the cookie
                        });
                        res.status(200).json({ message: 'User logged out successfully' });
    });

    // @desc 	 	 	 	Get user profile
    // @route 	 	GET /api/auth/profile
    // @access 	Private
    const getUserProfile = asyncHandler(async (req, res) => {
                        const user = {
                                        _id: req.user._id,
                                        username: req.user.username,
                                        email: req.user.email,
                                        isAdmin: req.user.isAdmin,
                        };
                        res.status(200).json(user);
    });

    // @desc 	 	 	 	Update user profile
    // @route 	 	PUT /api/auth/profile
    // @access 	Private
    const updateUserProfile = asyncHandler(async (req, res) => {
                        const user = await User.findById(req.user._id);

                        if (user) {
                                        user.username = req.body.username || user.username;
                                        user.email = req.body.email || user.email;

                                        if (req.body.password) {
                                                        user.password = req.body.password;
                                        }

                                        const updatedUser = await user.save();

                                        res.status(200).json({
                                                        _id: updatedUser._id,
                                                        username: updatedUser.username,
                                                        email: updatedUser.email,
                                                        isAdmin: updatedUser.isAdmin,
                                        });
                        } else {
                                        res.status(404);
                                        throw new Error('User not found');
                        }
    });

    // @desc    Delete user account
    // @route   DELETE /api/auth/:id 
    // @access  Private
    const deleteUser = asyncHandler(async (req, res) => {
        // CRITICAL FIX: Get ID from the URL parameter (req.params.id) 
        const userIdToDelete = req.params.id; 
        const requestingUser = req.user._id;

        // Security Check: Ensure logged-in user can only delete their own account
        if (userIdToDelete.toString() !== requestingUser.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this specific account.');
        }

        const user = await User.findById(userIdToDelete);

        if (!user) {
            res.status(404);
            throw new Error('User not found.');
        }

        // Data Cleanup: Delete all reviews written by this user
        await Review.deleteMany({ user: userIdToDelete });

        // Delete the user
        await User.deleteOne({ _id: userIdToDelete });

        // Clear the JWT cookie
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0), 
        });

        res.status(200).json({ message: 'User account and associated data successfully removed.' });
    });


    module.exports = {
                        registerUser,
                        loginUser,
                        logoutUser,
                        getUserProfile,
                        updateUserProfile,
            deleteUser, // ⬅️ Must be included in exports
    };