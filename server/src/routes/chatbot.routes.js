const express = require('express');
const { UserChatSignup, checkUserByIp } = require('../controller/Chatboat');

const router=express.Router()

router.route('/chat').post(UserChatSignup)
// router.route('/checkUserByIp').get(checkUserByIp)

module.exports = router;


