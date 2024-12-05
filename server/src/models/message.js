const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  username: { type: String, },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const MessageModel = mongoose.model("Message", messageSchema);
module.exports = MessageModel;
