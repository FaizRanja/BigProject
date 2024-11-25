const express = require('express');
const validateApiKey = require('../middleware/Validmiddleware');
const { chatboat, chatboatcss } = require('../controller/Chatboat');


const router=express.Router()

router.route('/chatboat.js').get(validateApiKey , chatboat)
router.route('/chatboa').get(validateApiKey , chatboatcss)