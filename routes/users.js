const express=require('express');
const router=express.Router();
const User=require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

const userController=require('../controllers/user');
//sign up route
router.get("/signup",userController.signup);

//sign up post route
router.post("/signup", wrapAsync(userController.signupPost));

//logout route
router.get("/logout",userController.logout);

//login route
router.get("/login",userController.login);

//login post route
router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{
        failureFlash:true,
        failureRedirect:"/login"
    }) ,userController.loginPost);

module.exports=router;