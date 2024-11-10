import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import { createError } from '../utils/error.js';
import asyncHandler from "../middleware/asyncHandler.js";

// Function to handle user signup
export const signup = async (req, res, next) => {
  const { username, email, password, firstName, lastName, qyteti, rruga } = req.body;
  console.log('Request Body:', req.body); // Log the request body

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Validate password length
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Return a custom error message if the email is already in use
      return res.status(400).json({ success: false, message: 'Ky përdorues ekziston' });
    }

    // Hash the password before storing it
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user, setting isAdmin to false by default
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isAdmin: false, // Set admin status to false by default
      homeAddress: qyteti && rruga ? { qyteti, rruga } : undefined, // Only set if both fields are provided
    });

    // Save the new user in the database
    await newUser.save();

    // Generate a JWT token for the new user, just like in signin
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Ensure this value is set to the intended duration
    );

    // Return user ID and token so they can access protected routes
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: newUser._id,
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    next(createError(500, 'Error creating user'));
  }
};

// Function to handle user signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(createError(404, "Përdoruesi nuk ekziston"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(createError(401, "Passwordi është gabim"));

    // Create JWT token with only user ID
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user ID, token, and isAdmin status
    res.status(200).json({
      userId: validUser._id,
      access_token: token,
      isAdmin: validUser.isAdmin,
      success: true
    });
  } catch (error) {
    console.error("Signin error:", error);
    next(createError(500, 'Error signing in'));
  }
};


// Function to check if the user is an admin
export const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ isAdmin: user.isAdmin });
  } catch (err) {
    console.error("Error checking admin status:", err);
    next(errorHandler(500, "Error checking admin status"));
  }
};



export const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
  }

  res.status(200).json({
      userId: req.user._id,
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phone: req.user.phone,
      homeAddress: req.user.homeAddress || null,
      isAdmin: req.user.isAdmin,
  });
});


// Common function to handle phone formatting with prefix
const formatPhoneWithPrefix = (phone, prefix) => {
  const phonePrefix = prefix === 'KOS' ? '+383' : '+355';
  return phone.startsWith('+') ? phone : phonePrefix + phone;
};

// Kasa Controller
export const updateUserKasa = async (req, res, next) => {
  const { firstName, lastName, qyteti, rruga, phone, prefix = 'AL' } = req.body;

  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (phone) updateFields.phone = formatPhoneWithPrefix(phone, prefix);

  // Ensure nested fields in `homeAddress` are updated correctly
  if (qyteti || rruga) {
    updateFields.homeAddress = {};
    if (qyteti) updateFields.homeAddress.qyteti = qyteti;
    if (rruga) updateFields.homeAddress.rruga = rruga;
  }

  console.log("User ID:", req.user.id);  // Log user ID
  console.log("Request Body:", req.body);  // Log request body
  console.log("Update Fields:", updateFields);  // Log update fields

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully from Kasa',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating Kasa profile:', error.message, error.stack);
    next(errorHandler(500, 'Error updating Kasa profile'));
  }
};



// Account Controller
export const updateUserProfile = async (req, res, next) => {

  console.log("User ID:", req.body);
  const { firstName, lastName, qyteti, rruga, phone, prefix } = req.body;
  const updateFields = {};

  // Only add fields to updateFields if they are provided in the request
  if (firstName !== undefined) updateFields.firstName = firstName;
  if (lastName !== undefined) updateFields.lastName = lastName;

  // Process and validate phone if provided
  if (phone !== undefined) {
    const formattedPhone = formatPhoneWithPrefix(phone, prefix || 'AL');
    const phoneRegex = /^(\+355\d{9}|\+383\d{8})$/;
    
    if (!phoneRegex.test(formattedPhone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    updateFields.phone = formattedPhone;
  }

  // Update homeAddress fields if provided
  if (qyteti !== undefined) updateFields['homeAddress.qyteti'] = qyteti;
  if (rruga !== undefined) updateFields['homeAddress.rruga'] = rruga;

    // Log user ID

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from returned data

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    next(errorHandler(500, 'Error updating profile'));
  }
};