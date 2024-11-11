const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Please provide username"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
});

module.exports = mongoose.model("User", UserSchema);
