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
        const _id = req.params._id;
        //const driver_rec = await driverModel.findOne({ _id });
        const driver_rec = await driverModel.findOne({ $and: [{ _id }, { working: true }] });
        if (driver_rec) {
            res.json({
                success: true,
                message: `The driver record of _Id ${_id} is`,
                record: driver_rec
            });
        } //if 
        else {
            res.json({
                success: true,
                message: `The driver record of _Id ${_id} is not found`,
            });
        } // else 
    } // try
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    } // catch
} // get Driver

// This is an api to update the driver record 
const updateDriver = async (req, res) => {
    try {
        const _id = req.params._id;
        console.log("The Driver Id:" + _id);
        const driver_rec = await driverModel.findOne({ $and: [{ _id }, { working: true }] });
        //const driver_rec = await driverModel.findOne({ _id });
        if (driver_rec) {

            const liscence_number = req.body.liscence_number;
            const found_driver = await driverModel.findOne({ liscence_number: liscence_number });

            if (found_driver) {
                res.json({
                    success: true,
                    message: `This updated liscense Number ${liscence_number} already registered to another driver`,

                });
            } // if(found_driver)
            else {

                const update_driver = await driverModel.findByIdAndUpdate(_id, req.body,
                    {
                        new: true
                    });  // update_driver
                console.log("Updated REcord:" + update_driver)
                res.json({
                    success: true,
                    message: `The ${_id} ID Driver Record updates Successfully`,
                    record: update_driver
                });
            } //else 
        } // if (driver_rec)
        else {
            res.json({
                success: true,
                message: `The driver record of _Id ${_id} is not found to update`,
            });
        } //else 

    }//try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    } // catch 

} // updateDriver 


const deleteDriver = async (req, res) => {
    try {
        const _id = req.params._id;
        const driver_rec = await driverModel.findOne({ $and: [{ _id }, { working: true }] });
        if (driver_rec) {
            const deleteDriver = await driverModel.findByIdAndUpdate({ _id }, { $set: { working: false } },
                {
                    new: true
                });
            res.json({
                success: true,
                message: `The driver record of _Id ${_id} deletes successfully`,
                record: deleteDriver
            })
        }
        else {
            res.json({
                success: true,
                message: `The driver record of _Id ${_id} is not found to or already deleted`,
            });
        }
    } // try 
    catch (error) {
        req.json({
            success: false,
            message: error.message
        });

    } // catch
}


module.exports =
{
    addDriver,
    listDrivers,
    getDriver,
    updateDriver,
    deleteDriver
}



