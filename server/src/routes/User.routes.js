const express = require('express');
const { Register, Login, Logout,  getAllRegisterUser, updateUserprofile, updatePassword, getUserdatils } = require('../controller/User.controller');
const { isAuthenticated } = require('../middleware/auth');
// const upload = require('../middleware/multer');

const router = express.Router();

router.route('/register').post(Register);
router.route('/updatesetting').post( isAuthenticated, updateUserprofile);
router.route('/me').get( isAuthenticated, getUserdatils);
router.route('/login').post(Login);
router.route('/updatePassword').post( isAuthenticated, updatePassword);
router.route('/logout/:id').post(Logout);
router.route('/Getallregisteruser').get(isAuthenticated,getAllRegisterUser)





module.exports = router;
