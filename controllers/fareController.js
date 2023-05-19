const fareModel = require("../models/fare");

//This is the method to generate an auto fare _id
const generateAutoFareId = async (req, res) => {
    var fareId = "";
    try {
        const fareCount = await fareModel.count();
        if (fareCount == 0) {
            fareId = "1101";

        }//if 
        else {
            let fareLastRec = await fareModel.findOne().sort({ _id: -1 }).limit(1);
            let fare_Id = Number(fareLastRec._id);
            fare_Id = fare_Id + 1;
            fareId = fare_Id.toString();
        }
        return fareId;  // returning the promise 
    } // try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });

    }

}

var addDetails = async (req, res) => {
    try {
        fare_id = await generateAutoFareId();
        const rideFare = new fareModel({
            _id: fare_id,
            seater_type: req.body.seater_type,
            fuel_type: req.body.fuel_type,
            rental_fare: req.body.rental_fare,
            ride_fare:req.body.ride_fare,
            tour_fare: req.body.tour_fare
        });   // fareModel
        const saveFare = await rideFare.save(); // adding the fare in the mongod
        res.json({
            success: true,
            message: "fare details recorded",
            record: saveFare
        }); // res.json 

    } // end of the try 
    catch (error) {
        console.log("Fare Details add error:", error);
        res.json({
            success: false,
            message: error.message,
        });
    } // end of the catch 
} // end of the add Details 

var listFare = async (req, res) => {
    try {
        const listFare = await fareModel.find();
        res.json({
            success: true,
            message: "The list of fare",
            records: listFare
        });
    } // end of the try 
    catch (error) {
        console.log("Fare Details list error:", error);
        res.json({
            success: false,
            message: error.message,
        });

    } // end of the catch
} // end of listFare 

var updateFare = async (req, res) => {
    try {
        const _id = req.params._id;
        let fareUpdate = await fareModel.findByIdAndUpdate({ _id }, req.body,
            {
                new: true
            });  //fareUpdate
        res.json({
            success: true,
            message: "The Fare is Updated /hour",
            updatedRecord: fareUpdate
        })

    }  // try 
    catch (error) {
        console.log("Fare Details list error:", error);
        res.json({
            success: false,
            message: error.message,
        });
    } // catch 
} //updateFare


module.exports = {
    listFare,
    addDetails,
    updateFare
}