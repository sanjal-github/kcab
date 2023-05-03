const express = require('express');
const user_routes = express.Router();
const userControl = require("../controllers/userController");

// calling the r̥outes 

user_routes.post("/userRegister",userControl.addUserInfo);
user_routes.post("/userLogin",userControl.userLogin);
user_routes.post("/verifyOTP",userControl.verifyOTP);
user_routes.put("/addUserInfo",userControl.addUserInfo);

module.exports = user_routes

