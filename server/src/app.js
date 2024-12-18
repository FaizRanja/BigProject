const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const User = require("./models/User.model");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const MessageModel = require("./models/message"); // Renamed to MessageModel



dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dzmcvxoah",
  api_key: "687945774492289",
  api_secret: "S_4vTeRwTf5RncuUoc7k6FGft7A",
});

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React frontend URL
    methods: ["GET", "POST"],
    credentials: true,

  },
});

// Middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(cors());
// Static files
app.use(express.static(path.join(__dirname, "dist")));

// Real-time chat functionality
const onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining
  socket.on("join", ({ username }) => {
    onlineUsers.set(socket.id, username);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.values()));
    console.log(`${username} joined`);
  });

  // Handle chat message
  socket.on("chatMessage", async (data) => {
    const { username, message } = data;
    console.log(username, message);

    // Save the message to MongoDB using MessageModel
    const newMessage = new MessageModel({ username, message });
    await newMessage.save();
    // Broadcast the message to all clients
    io.emit("chatMessage", data);
  });

  // Handle user typing indicator
  socket.on("typing", ({ username, isTyping }) => {
    socket.broadcast.emit("typing", { username, isTyping });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      onlineUsers.delete(socket.id);
      io.emit("updateOnlineUsers", Array.from(onlineUsers.values()));
      console.log(`${username} disconnected`);
    }
  });
});

// API to fetch recent messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await MessageModel.find().sort({ timestamp: -1 }).limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API key validation middleware
const validateApiKey = async (req, res, next) => {
  const secretKey = req.query.key || req.headers["x-api-key"];

  try {
    const user = await User.findOne({ secretKey });

    if (!user) {
      return res.status(403).json({ error: "Invalid or missing API key" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Serve chatbot.js and chatbot.css with API key validation
app.get("/chatbot.js", validateApiKey, (req, res) => {
  res.sendFile(path.join(__dirname, "chatbot.js"));
});

app.get("/chatbot.css", validateApiKey, (req, res) => {
  res.sendFile(path.join(__dirname, "chatbot.css")); // Path to chatbot.css
});

// Import routes
const userRoutes = require("./routes/User.routes");
app.use("/api/v1/user", userRoutes);

// Export app for use in server.js
module.exports = { server };
