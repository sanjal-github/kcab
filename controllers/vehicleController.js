const vehicleModel = require("../models/vehicles");

// To generates auto vehicle id 
const autoVehicleId = async () => {
    try {
        let vehicle_Id = 0;
        let count = await vehicleModel.count();
        if (count == 0) {
            vehicle_Id = 31001;
        }
        else {
            let last_vehicle = await vehicleModel.findOne().sort({ _id: -1 }).limit(1);
            vehicle_Id = Number(last_vehicle._id); // converts String to Number 
            vehicle_Id = vehicle_Id + 1;
        }
        console.log("The VID is:" + vehicle_Id);
        return vehicle_Id.toString();

    } // try 
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }//catch
}

//To add Vehicle Details
const addVehicle = async (req, res) => {
    try {
        let vehicle_no = req.body.vehicle_no;
        let vehicleData = await vehicleModel.findOne({ vehicle_no: vehicle_no });
        if (!vehicleData) {
            let vid = await autoVehicleId(); // To generate auto vehicle Id
            const vehicle = new vehicleModel({
                _id: vid,
                vehicle_no: req.body.vehicle_no,
                name: req.body.name,
                brand: req.body.brand,
                model: req.body.model,
                color: req.body.color,
                fuel_type: req.body.fuel_type,
                seater_type: req.body.seater_type,
                image: req.file.filename,
                price: req.body.price
            });
            const vehicleSave = await vehicle.save();
            res.json({
                success: true,
                message: "The new Vehicle Record added",
                record: vehicleSave
            });
        }//if
        else {
            res.json({
                success: true,
                message: `This Vehicle Number ${vehicle_no} already added`
            });
        } //else 

    } // end of the try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}


// To get the Vehicles Details
const listVehicles = async (req, res) => {
    try {
        const vehicles_Data = await vehicleModel.aggregate([{ $project: { _id: 1, vehicle_no:1,name: 1, model: 1, color: 1 } }]);

        if (vehicles_Data.length > 0) {
            res.json({
                success: true,
                message: "The Veḥicles Records are",
                record: vehicles_Data
            });
        }//if 
        else {
            res.json({
                success: true,
                message: "The Veḥicles Records list is empty",
                record: vehicles_Data
            });
        }


    }//try
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// To display the vehicle record using its _id
const display_vehicle = async (req, res) => {
    try {
        let _id = req.params._id;
        const vehicle_data = await vehicleModel.findOne({ _id });

        if (vehicle_data) {
            res.json({
                success: true,
                message: "Vehicle Found",
                record: vehicle_data
            })
        }
        else {
            res.json({
                success: true,
                message: "Vehicle not Found",
                record: vehicle_data
            })
        }

    }
    catch (error) {
        res.json({
            success: false,
            message: `Error while displaying vehicle record ${error.message}`
        })
    }
}

// To update the vehicle details using its _id 
const update_vehicle = async (req, res) => {
    try {
        let _id = req.params._id;
        const update_vehicle = await vehicleModel.findByIdAndUpdate({ _id }, req.body,
            {
                new: true
            });

        res.json({
            success: true,
            message: `The Vehicle Record of id:${_id} updates Successfully`,
            record: update_vehicle
        })
    }
    catch (error) {
        res.json({
            success: false,
            message: `Error while updating vehicle record ${error.message}`
        })
    }
}


// To delete the Vehicle record using its _id

const hard_delete_vehicle = async (req, res) => {
    try {
        let _id = req.params._id;
        const delete_vehicle = await vehicleModel.findByIdAndDelete({ _id });
        if (!delete_vehicle) {
            res.json({
                success: true,
                message: `The Vehicle Record of id:${_id} cant Exist`,
            })
        }  //if 
        else {
            res.json({
                success: true,
                message: `The Vehicle Record of id:${_id} hard deletes Successfully`,
                record: delete_vehicle
            });
        } // else 
    }
    catch (error) {
        res.json({
            success: false,
            message: `Error while deleting vehicle record ${error.message}`
        })
    }
}

const soft_delete_vehicle = async (req, res) => {
    try {
        let _id = req.params._id;
        const delete_vehicle = await vehicleModel.findOne({ _id });
        if (!delete_vehicle) {
            res.json({
                success: true,
                message: `The Vehicle Record of id:${_id} cant Exist`,
            })
        }  //if 
        else {
            const chng_status = await vehicleModel.findByIdAndUpdate({ _id },
                {
                    $set: {
                        status: "deactive",
                    }
                },
                {
                    new: true
                });
            res.json({
                success: true,
                message: `The Vehicle Record of id:${_id} soft deletes Successfully`,
                record: delete_vehicle
            });
        } // else 
    }
    catch (error) {
        res.json({
            success: false,
            message: `Error while deleting vehicle record ${error.message}`
        })
    }
}

module.exports =
{
    addVehicle,
    listVehicles,
    display_vehicle,
    update_vehicle,
    hard_delete_vehicle,
    soft_delete_vehicle
}