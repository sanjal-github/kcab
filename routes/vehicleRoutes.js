const express = require('express');
const vehicle_routes = express.Router();
const vehicleControl = require("../controllers/vehicleController");
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/vehicleImages"), function (error, success) {
            if (error) {
                throw error;
            }
        });

    },// distination

    filename: function (req, file, cb) {
        let fn = Date.now() + "-" + file.originalname;
        cb(null, fn, function (error, success) {
            if (error) {
                throw error;
            }
        });

    }


});  // multer.diskStorage

let uploadImage = multer({storage:storage})




// Routers of an api for vehicle 
vehicle_routes.post("/vehicle", uploadImage.single("image"),vehicleControl.addVehicle);
//vehicle_routes.post("/vehicle", vehicleControl.addVehicle); // this api not uploading an image
vehicle_routes.get("/vehicle", vehicleControl.listVehicles);
vehicle_routes.get("/vehicle/:_id", vehicleControl.display_vehicle);
vehicle_routes.put("/vehicle/:_id", vehicleControl.update_vehicle);
vehicle_routes.delete("/vehicle/hardDelete/:_id", vehicleControl.hard_delete_vehicle);
vehicle_routes.delete("/vehicle/softDelete/:_id", vehicleControl.soft_delete_vehicle);

module.exports = vehicle_routes;
