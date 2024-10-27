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
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  homeAddress: {  // Nested address object
    qyteti: {
      type: String,  // City
    },
    rruga: {
      type: String,  // Street
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
