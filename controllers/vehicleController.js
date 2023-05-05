const vehicleModel = require("../models/vehicles");

const addVehicle = async (req, res) => {
    try {
        const vehicle = new vehicleModel({
            _id: id,
            rto_no: req.body.rto_no,
            name: req.body.name,
            brand: req.body.brand,
            model: req.body.model,
            color: req.body.color,
            fuel_type: req.body._id,
            seater_type: req.body.seater_type,
            price: req.body.price
        });
        const vehicleSave = await vehicle.save();
        res.json({
            success: true,
            message: "The new Vehicle Record added",
            record: vehicleSave
        });

    } // end of the try 
    catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


module.exports =
{
    addVehicle
}