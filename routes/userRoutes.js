const express = require('express');
const user_routes = express.Router();
const userControl = require("../controllers/userController");

// calling the r̥outes 

user_routes.post("/userRegister",userControl.userRegistration);
user_routes.post("/userLogin",userControl.userLogin);
user_routes.post("/verifyOTP",userControl.verifyOTP);
module.exports = user_routes

