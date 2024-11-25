const ApiErrorHandler = require("../utils/ApiError.js");
const AsynicHandler = require("../utils/AsynicHandler");

exports .chatboat =AsynicHandler(async(req,res,next)=>{
    const filePath = path.join(__dirname, "chatbot.js"); // Path to chatbot.js file
    res.sendFile(filePath);
}) 


exports.chatboatcss=AsynicHandler (async(req,res,next)=>{
    const filePath = path.join(__dirname, "chatbot.css"); // Path to chatbot.css file
    res.sendFile(filePath);
})