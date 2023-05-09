const express = require("express");
const driver_routes = express.Router();
const driverControl = require("../controllers/driverController");
const multer = require("multer");
const path = require('path');
const storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,path.join(__dirname,"../public/driverImages"),function(error,success){
            if(error)
            {
                throw error;
            }
        }); // cb
    }, //distination 
    
    filename:function(req,file,cb)
    {   let fn= Date.now()+"-"+file.originalname; 
        cb(null,fn,function(error,success){
            if(error)
            {
                throw error;
            }
        }); // cb
    }
}); // storage

const uploadDriver = multer({storage:storage});

driver_routes.post("/driver",uploadDriver.single("photo"),driverControl.addDriver);
driver_routes.get("/driver",driverControl.listDrivers);
driver_routes.get("/driver/:_id",driverControl.getDriver);
driver_routes.put("/driver/:_id",uploadDriver.single("photo"),driverControl.updateDriver);
driver_routes.delete("/driver/:_id",driverControl.deleteDriver);
module.exports = driver_routes;