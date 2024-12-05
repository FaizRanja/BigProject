const message = require("../models/message");
const AsynicHandler = require("../utils/AsynicHandler");

exports.sendMessage=AsynicHandler(async(req,res,next)=>{

        try {
        const messages = await message.find().sort({ timestamp: -1 }).limit(50);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

// Socket.IO setup
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for incoming messages
    socket.on("chatMessage", async (data) => {
        const { username, message } = data;

        // Save message to MongoDB
        const newMessage = new message({ username, message });
        await newMessage.save();

        // Broadcast the message to all clients
        io.emit("chatMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});