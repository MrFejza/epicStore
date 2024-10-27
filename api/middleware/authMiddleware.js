import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/user.model.js'; // Ensure User model is imported

// Protect routes
const protect = asyncHandler(async (request, response, next) => {
    let token;

    // Read the JWT from the cookie
    token = request.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Use 'decoded.id' (not 'decoded.userId') to match what is stored in the token
            request.user = await User.findById(decoded.id).select('-password');
            
            next();
        } catch (error) {
            console.error(error);
            response.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        response.status(401);
        throw new Error('Not authorized, no token');
    }
});

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach decoded user data to req.user
            req.user = decoded;
            
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ success: false, message: 'Invalid token' });
        }
    } else {
        console.log('No token provided');
        res.status(403).json({ success: false, message: 'No token provided' });
    }
};

export { protect };
