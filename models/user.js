import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  google: {
    type: Number,
    required: false,
    default: 0,
  },
  solvedCount: {
    type: Number,
    required: false,
    default: 0,
  },
  trueCount: {
    type: Number,
    required: false,
    default: 0,
  },
  falseCount: {
    type: Number,
    required: false,
    default: 0,
  },
  admin: {
    type: Number,
    required: false,
    default: 0,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
