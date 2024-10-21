import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Conditionally required: only required if the user does not have a social login
    required: function () {
      return !( this.googleId);
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,  // Ensures only non-null values are treated as unique
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true  // Automatically add createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);

export default User;
