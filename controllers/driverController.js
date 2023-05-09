const driverModel = require("../models/driver");



// to create an auto driver Id
const autoDriverId = async () => {
    try {
        let driver_Id = 0;
        let count = await driverModel.count();
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
        console.log(error);
    }//catch
} // autoSriverId


const addDriver = async (req, res) => {
    try {
        const liscence_number = req.body.liscence_number;  // fetching the liscence number 
        const driver_count = await driverModel.aggregate([{ $match: { liscence_number: liscence_number } }, { $count: "total" }]);

        if (driver_count == 0) {
            const driver_Id = await autoDriverId(); // function call to auto generate driver _id
            console.log("Driver Id is " + driver_Id);
            const driver_data = new driverModel({
                _id: driver_Id,
                name: req.body.name,
                address: req.body.address,
                mobile: req.body.mobile,
                birth_date: req.body.birth_date,
                gender: req.body.gender,
                photo: req.file.filename,
                liscence_number: req.body.liscence_number
            });

            const driver_save = await driver_data.save();
            res.json({
                success: true,
                message: "The Driver Data loads at Server",
                records: driver_save
            });
        } // if driver 
        else {
            res.json({
                success: true,
                message: `This liscense number ${liscence_number} already register to another driver....plz check it`
            })
        }
    }  // try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }//catch
} // add driver 


// This is an api to fetch the records of the drivers who is now working 
const listDrivers = async (req, res) => {
    try {
        const drivers = await driverModel.aggregate([{ $match: { working: true } }]);

        if (drivers) {
            res.json({
                success: true,
                message: "The List of the Active Drivers",
                records: drivers
            });
        } // if 
        else {
            res.json({
                success: true,
                message: "None Driver is now currently working"
            });
        } //else 
    } // try end 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    } // catch 
} // list Driver


const getDriver = async (req, res) => {
    try {

    } // try
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    } // catch
}


module.exports =
{
    addDriver,
    listDrivers
}



