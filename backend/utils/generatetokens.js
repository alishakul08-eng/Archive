const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
	 	 const token = jwt.sign(
	 	 	 	 // 🔑 FIX: Change from { userId } to { id: userId }
	 	 	 	 { id: userId }, 
	 	 	 	 process.env.JWT_SECRET,
	 	 	 	 {
	 	 	 	 	 	 expiresIn: '30d', 
	 	 	 	 }
	 	 );

	 	 res.cookie('jwt', token, {
	 	 	 	 httpOnly: true, 
	 	 	 	 secure: process.env.NODE_ENV !== 'development',
	 	 	 	 sameSite: 'strict', 
	 	 	 	 maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
	 	 });
};

module.exports = generateToken;