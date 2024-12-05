// const express = require("express");
// const mongoose = require("mongoose");
// const http = require("http");
// const { Server } = require("socket.io");


// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     },
// });

// // Middleware


// // Message Schema and Model
// const messageSchema = new mongoose.Schema({
//     username: String,
//     message: String,
//     timestamp: { type: Date, default: Date.now },
// });
// const Message = mongoose.model("Message", messageSchema);

// // Routes
// app.get("/messages", async (req, res) => {
//     try {
//         const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
//         res.json(messages);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Socket.IO setup
// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     // Listen for incoming messages
//     socket.on("chatMessage", async (data) => {
//         const { username, message } = data;

//         // Save message to MongoDB
//         const newMessage = new Message({ username, message });
//         await newMessage.save();

//         // Broadcast the message to all clients
//         io.emit("chatMessage", data);
//     });

//     socket.on("disconnect", () => {
//         console.log("A user disconnected:", socket.id);
//     });
// });

// // Start the server
// const PORT = 5000;
// server.listen(PORT, () => {
//     console.log(Server running on http://localhost:${PORT});
// });
// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:5000");

// const Chat = () => {
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const [username, setUsername] = useState("");

//     useEffect(() => {
//         // Fetch previous messages from the server
//         axios.get("http://localhost:5000/messages")
//             .then((response) => setMessages(response.data.reverse()))
//             .catch((error) => console.error("Error fetching messages:", error));

//         // Listen for new messages
//         socket.on("chatMessage", (data) => {
//             setMessages((prevMessages) => [...prevMessages, data]);
//         });

//         return () => socket.disconnect();
//     }, []);

//     const handleSendMessage = (e) => {
//         e.preventDefault();

//         if (message.trim() && username.trim()) {
//             const data = { username, message };
//             socket.emit("chatMessage", data);
//             setMessage("");
//         }
//     };

//     return (
//         <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
//             <h1>Chat Application</h1>

//             <div style={{ marginBottom: "10px" }}>
//                 <input
//                     type="text"
//                     placeholder="Enter your name"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
//                 />
//             </div>

//             <div style={{
//                 height: "300px",
//                 overflowY: "scroll",
//                 border: "1px solid #ccc",
//                 padding: "10px",
//                 marginBottom: "10px"
//             }}>
//                 {messages.map((msg, index) => (
//                     <div key={index}>
//                         <strong>{msg.username}: </strong>
//                         <span>{msg.message}</span>
//                     </div>
//                 ))}
//             </div>

//             <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px" }}>
//                 <input
//                     type="text"
//                     placeholder="Type a message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     style={{ flex: 1, padding: "10px" }}
//                 />
//                 <button type="submit" style={{ padding: "10px 20px" }}>Send</button>
//             </form>
//         </div>
//     );
// };

// export default Chat;