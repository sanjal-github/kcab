const express = require("express");
const rental_routes = express.Router();
const rentalCabControl = require("../controllers/rentalController");

rental_routes.post("/rentalCab",rentalCabControl.rentalCabAdd);
rental_routes.get("/rentalCab",rentalCabControl.listRentalCab);
rental_routes.put("/currentLocation/:_id",rentalCabControl.enterCurrentLocation);
rental_routes.put("/manualLocation/:_id",rentalCabControl.enterManualLocation);
rental_routes.put("/cancelRentalRide/:_id",rentalCabControl.cancelRentalRide);
module.exports = rental_routes;