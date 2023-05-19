const express = require("express");
const fare_routes = express.Router();
const fareController = require("../controllers/fareController");

fare_routes.post("/rideFare",fareController.addDetails);
fare_routes.get("/rideFare",fareController.listFare);
fare_routes.put("/rideFare/:_id",fareController.updateFare);

module.exports = fare_routes;
