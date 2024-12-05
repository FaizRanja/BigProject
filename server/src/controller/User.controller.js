const AsyncHandler = require("../utils/AsynicHandler");
const User = require('../models/User.model');
const sendToken = require('../utils/sendToken'); // Ensure this is the correct import
const crypto = require('crypto');
const ApiErrorHandler = require("../utils/ApiError.js");
// const AsynicHandler = require("../utils/AsynicHandler");
// const apifeatucher = require("../utils/Search.js");



exports.Register = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if any field is empty
  if (!name || !email || !password) {
    return next(new ApiErrorHandler(400, "All fields are required"));
  }

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return next(new ApiErrorHandler("User with this email already exists", 409));
  }

  // Generate random secret key
  const secretKey = crypto.randomBytes(32).toString('hex');

  // Create a new user with the generated secret key
  const user = await User.create({
    name,
    email,
    password,
    secretKey, // Pass the generated secret key here
  });

  // Send the JWT token and the secret key in the response
  sendToken(user, 201, res, user.secretKey);
});

exports.Login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw next(new ApiErrorHandler(400, "All fields are required"));
  }

  
  
  
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw next(new ApiErrorHandler(400, "User not found"));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw next(new ApiErrorHandler(401, "Invalid email or password"));
  }
  sendToken(user, 200, res);
});

// LogOut User
exports.Logout=AsyncHandler(async(req,res,next)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true,
  })
  res.status(200).json({
    success:true,
    message:" User  Logged Out successfully",
  })
})
// get all register user data
exports.getAllRegisterUser = async (req, res) => {
  try {
    const user = req.user; // req.user is set by the authMiddleware
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const { secretKey } = user; // Extract the secretKey from the user object
    return res.status(200).json({
      success: true,
      user: { secretKey },
      instructions: `
        <script src="http://localhost:4000/chatbot.js?key=${secretKey}"></script>
        <link rel="stylesheet" href="http://localhost:4000/chatbot.css?key=${secretKey}">
      `,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching user details",
      error: error.message,
    });
  }
};









