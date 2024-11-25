const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('./models/User.model')
const path = require("path");


// Load environment variables
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dzmcvxoah",
  api_key: "687945774492289",
  api_secret: "S_4vTeRwTf5RncuUoc7k6FGft7A"
});

// Initialize Express
const app = express();

// Middleware

app.use(cors({
  origin: 'http://localhost:5173',  // Your React frontend origin
  credentials: true,  // Allow credentials to be sent
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage });



// Cloudinary upload API
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    // Create a stream for Cloudinary upload
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json({ url: result.secure_url });
      }
    );
    // Pipe the file stream to Cloudinary
    req.file.stream.pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// by sending the script and css file 

const validateApiKey = async (req, res, next) => {
  const secretKey = req.query.key || req.headers["x-api-key"];

  // Use findOne to search for the user with the provided API key
  try {
    const user = await User.findOne({ secretKey });  // Correct method and use await for async operation

    if (!user) {
      return res.status(403).json({ error: "Invalid or missing API key" });
    }

    req.user = user; // Attach user info to the request
    next();  // Proceed to the next middleware
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Serve chatbot.js with API key validation
app.get("/chatbot.js", validateApiKey, (req, res) => {
  const filePath = path.join(__dirname, "chatbot.js"); // Path to chatbot.js file
  res.sendFile(filePath);
});

// Serve chatbot.css with API key validation
app.get("/chatbot.css", validateApiKey, (req, res) => {
  const filePath = path.join(__dirname, "chatbot.css"); // Path to chatbot.css file
  res.sendFile(filePath);
});




// Import routes
const userRoutes = require("./routes/User.routes");

app.use("/api/v1/user", userRoutes);

// Export app for use in server.js
module.exports = { app };
