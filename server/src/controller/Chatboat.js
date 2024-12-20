const AsyncHandler = require("../utils/AsynicHandler");
const ChatSign = require("../models/UserChatSignup");
const cloudinary = require("cloudinary").v2;

exports.UserChatSignup = AsyncHandler(async (req, res, next) => {
  const { UserName, email, avatar } = req.body;
  console.log(UserName,email,avatar)
  if (!UserName || !email || !avatar) {
    return res.status(400).json({ error: "All fields are required" });
  }
  // Check if the user already exists
  const existingUser = await ChatSign.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User with this email already exists" });
  }

  
  // Upload avatar to Cloudinary
  let myCloud;
  try {
    myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",


    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res.status(500).json({ error: "Failed to upload avatar to Cloudinary" });
  }

  // Create user in the database
  const user = await ChatSign.create({
    UserName,
    email,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  // Send response
  res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
});
