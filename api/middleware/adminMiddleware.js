export const checkAdmin = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    console.log('No token provided');
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('User not found');
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    if (!user.isAdmin) {
      console.log('User is not an admin');
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    req.user = user; // Add user to request object
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Updated to error.log
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
