const express = require("express");
const rental_routes = express.Router();
const rentalCabControl = require("../controllers/rentalController");

rental_routes.post("/rentalCab",rentalCabControl.rentalCabAdd);
rental_routes.get("/rentalCab",rentalCabControl.listRentalCab);
rental_routes.put("/currentLocation/:_id",rentalCabControl.enterCurrentLocation);

module.exports = rental_routes;