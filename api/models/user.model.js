import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
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
  phone: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        // Allow +355 with 9 digits or +383 with 8 digits
        return /^(\+355\d{9}|\+383\d{8})$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  homeAddress: {
    qyteti: {
      type: String,
    },
    rruga: {
      type: String,
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
