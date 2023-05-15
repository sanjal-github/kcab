const express = require("express");
const rental_routes = express.Router();
const rentalCabControl = require("../controllers/rentalController");

rental_routes.post("/rentalCab",rentalCabControl.rentalCabAdd);
rental_routes.get("/rentalCab",rentalCabControl.listRentalCab);
module.exports = rental_routes;