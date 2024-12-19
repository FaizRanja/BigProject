const express = require('express');
const { UserChatSignup } = require('../controller/Chatboat');

const router=express.Router()

router.route('/chat').post(UserChatSignup)


module.exports = router;