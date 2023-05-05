const express = require('express');
const vehicle_routes = express.Router();
const vehicleControl = require("../controllers/vehicleController");

vehicle_routes.post("/vehicle", vehicleControl.addVehicle);


module.exports = vehicle_routes;
