const driverModel = require("../models/driver");



// to create an auto driver Id
const autoDriverId = async () => {
    try {
        let driver_Id = 0;
        let count = await vehicleModel.count();
        if (count == 0) {
            driver_Id = 31001;
        }
        else {
            let last_driver = await driverModel.findOne().sort({ _id: -1 }).limit(1);
            driver_Id = Number(last_driver._id); // converts String to Number 
            driver_Id = driver_Id + 1;
        }
        console.log("The VID is:" + driver_Id);
        return driver_Id.toString();

    } // try 
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }//catch
}


const addDriver = async (req, res) => {
    try {
        
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}



