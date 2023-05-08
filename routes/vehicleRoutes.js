const express = require('express');
const vehicle_routes = express.Router();
const vehicleControl = require("../controllers/vehicleController");


// Routers of an api for vehicle 
vehicle_routes.post("/vehicle", vehicleControl.addVehicle);
vehicle_routes.get("/vehicle",vehicleControl.listVehicles);
vehicle_routes.get("/vehicle/:_id",vehicleControl.display_vehicle);
vehicle_routes.put("/vehicle/:_id",vehicleControl.update_vehicle);
vehicle_routes.delete("/vehicle/hardDelete/:_id",vehicleControl.hard_delete_vehicle);
vehicle_routes.delete("/vehicle/softDelete/:_id",vehicleControl.soft_delete_vehicle);

module.exports = vehicle_routes;
