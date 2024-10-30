import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// Function to handle user signup
export const signup = async (req, res, next) => {
  const { username, email, password, firstName, lastName, qyteti, rruga, isAdmin } = req.body;
  console.log('Request Body:', req.body); // Log the request body

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Hash the password before storing it
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user with the provided details, including homeAddress if provided
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isAdmin,
      homeAddress: qyteti && rruga ? { qyteti, rruga } : undefined, // Only set if both fields are provided
    });

    // Save the new user in the database
    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    next(errorHandler(500, 'Error creating user'));
  }
};

// Function to handle user signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials"));

    // Create JWT token including isAdmin property
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return user ID, token, and isAdmin status alongside success flag
    res.status(200).json({
      userId: validUser._id,
      access_token: token,
      isAdmin: validUser.isAdmin,
      success: true
    });
  } catch (error) {
    console.error("Signin error:", error);
    next(errorHandler(500, 'Error signing in'));
  }
};

// Function to check if the user is an admin
export const checkAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ isAdmin: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ isAdmin: false, message: "User not found" });
    }

    res.status(200).json({ isAdmin: user.isAdmin });
  } catch (err) {
    console.error('Error checking admin status:', err);
    next(errorHandler(500, 'Error checking admin status'));
  }
};

// Function to get user profile based on user ID
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      userId: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      homeAddress: user.homeAddress || null, // Include homeAddress or null if empty
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    next(errorHandler(500, 'Error fetching user profile'));
  }
};

// Function to update user profile
export const updateUserProfile = async (req, res, next) => {
  const { firstName, lastName, qyteti, rruga, phone } = req.body;

  // Create an update object dynamically based on provided fields, excluding email
  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (phone) updateFields.phone = phone;

  // Handle partial updates to homeAddress fields without overwriting the whole object
  if (qyteti) updateFields['homeAddress.qyteti'] = qyteti;
  if (rruga) updateFields['homeAddress.rruga'] = rruga;

  try {
    // Update user profile based on req.user.id
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields }, // Use $set to prevent conflicts
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from returned data

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        userId: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email, // Email remains unchanged
        phone: updatedUser.phone,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        homeAddress: updatedUser.homeAddress,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    next(errorHandler(500, 'Error updating profile'));
  }
};


