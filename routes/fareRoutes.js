const express = require("express");
const fare_routes = express.Router();
const fareController = require("../controllers/fareController");

fare_routes.post("/cabFare",fareController.addDetails);
fare_routes.get("/cabFare",fareController.listFare);
fare_routes.put("/cabFare/:_id",fareController.updateFare);

module.exports = fare_routes;
