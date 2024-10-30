import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/user.model.js'; // Ensure User model is imported

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password'); // Attach user object to `req.user`
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
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
