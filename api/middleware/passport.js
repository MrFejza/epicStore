import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

// Serialize the user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);  // Only store the user ID in the session
});

// Deserialize the user from the session using the stored ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // Find the user by ID in the database
    done(null, user);  // Return the user object
  } catch (err) {
    done(err, null);
  }
});

// Facebook strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, emails, name } = profile;

    // Check if a user with this Facebook ID exists
    let user = await User.findOne({ facebookId: id });

    if (!user) {
      // Check if a user with the same email exists
      user = await User.findOne({ email: emails[0].value });

      if (user) {
        // Link the Facebook account to the existing user
        user.facebookId = id;
        await user.save();
      } else {
        // Create a new user if no existing user is found
        user = await User.create({
          username: name.givenName,
          email: emails[0].value,
          facebookId: id
        });
      }
    }

    return done(null, user);
  } catch (error) {
    console.error('Error in Facebook strategy:', error);
    return done(error, false);
  }
}));

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, emails, displayName } = profile;

    // Check if a user with this Google ID exists
    let user = await User.findOne({ googleId: id });

    if (!user) {
      // Check if a user with the same email exists
      user = await User.findOne({ email: emails[0].value });

      if (user) {
        // Link the Google account to the existing user
        user.googleId = id;
        await user.save();
      } else {
        // Create a new user if no existing user is found
        user = await User.create({
          username: displayName,
          email: emails[0].value,
          googleId: id
        });
      }
    }

    return done(null, user);
  } catch (error) {
    console.error('Error in Google strategy:', error);
    return done(error, false);
  }
}));

