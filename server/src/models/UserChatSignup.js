const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
 
  UserName: {
    type: String,
    required: [true, "Please enter your last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true, // Ensure email is unique
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Compare password


module.exports = mongoose.model("ChatSign", UserSchema);
