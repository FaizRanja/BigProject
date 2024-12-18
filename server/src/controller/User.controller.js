const AsyncHandler = require("../utils/AsynicHandler");
const User = require('../models/User.model');
const sendToken = require('../utils/sendToken'); // Ensure this is the correct import
const crypto = require('crypto');
const ApiErrorHandler = require("../utils/ApiError.js");
// const cloudinary = require("cloudinary").v2;

// User Registration
exports.Register = AsyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return next(new ApiErrorHandler(400, "All fields are required"));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiErrorHandler(409, "User with this email already exists"));
  }

  // Generate random secret key
  const secretKey = crypto.randomBytes(32).toString("hex");

  // Create user in the database
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    secretKey,
  });

  // Send token response
  sendToken(user, 201, res, secretKey);
});


// User Login
exports.Login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return next(new ApiErrorHandler(400, "All fields are required"));
  }
  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ApiErrorHandler(404, "User not found"));
  }

  // Verify password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ApiErrorHandler(401, "Invalid email or password"));
  }

  // Send token response
  sendToken(user, 200, res);
});


// User Logout
exports.Logout = AsyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// Get All Registered Users
exports.getAllRegisterUser = AsyncHandler(async (req, res) => {
  const user = req.user; // req.user is set by auth middleware
  if (!user) {
    return next(new ApiErrorHandler(404, "User not found"));
  }

  const { secretKey } = user;

  res.status(200).json({
    success: true,
    user: { secretKey },
    instructions: `
      <script src="http://localhost:4000/chatbot.js?key=${secretKey}"></script>
      <link rel="stylesheet" href="http://localhost:4000/chatbot.css?key=${secretKey}">
    `,
  });
});


// Upadte user profile 

exports.updateUserprofile = AsyncHandler(async (req, res, next) => {
  try {
    // Validate that req.user exists
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const { firstName, lastName, email } = req.body;

    // Validate input fields (aditional validation can be added as needed)
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (firstName, lastName, email)",
      });
    }
    // Prepare the data for update
    const newData = { firstName, lastName, email };

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(req.user.id, newData, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on update
    });

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Send a success response with updated user data
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // Catch and handle any errors
    next(error);
  }
});
// Update Password 
exports.updatePassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ApiErrorHandler("Old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ApiErrorHandler("password does not match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Deatils 

exports.getUserdatils=AsyncHandler(async(req,res,next)=>{
  const user=await User.findById(req.user.id)
  res.status(200).json({
    success:true,
    user,
  })
  
  })
  


