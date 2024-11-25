const express = require('express');
const { Register, Login, Logout,  getAllRegisterUser } = require('../controller/User.controller');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/logout').post(Logout);
router.route('/Getallregisteruser').get(isAuthenticated,getAllRegisterUser)

module.exports = router;
