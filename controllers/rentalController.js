const rentalCabModel = require("../models/rentalBooking");
const userModel = require("../models/users");
const locationModel = require("../models/rentalLocation");
const vehicleModel = require("../models/vehicles");
const vehicle = require("../models/vehicles");
const rentalOTPVerifyModel = require("../models/rentalOTPVerify");
const otpGenerator = require("otp-generator");
let generateAutoId = async (req, res) => {
    try {
        let rental_id = 0;
        let rentalCab = await rentalCabModel.count();
        if (rentalCab == 0)  // the database table is empty 
        {
            rental_id = 67011;

        }
        else {
            let rental_idd = await rentalCabModel.findOne().sort({ _id: -1 }).limit(1);
            rental_id = Number(rental_idd._id);
            rental_id = rental_id + 1;
        }
        return rental_id.toString();

    } // try 
    catch (error) {
        console.log("An Auto Generate Id:", error)
    } // catch 
}

let rentalCabAdd = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        let chk_user = await userModel.findOne({ _id: user_id });
        if (chk_user) {
            let seater_type = req.body.seater_type;

            // This the aggregation for finding the available vehicle for rental booking
            const rental_vehical = await vehicleModel.findOne({
                $and: [{ seater_type: seater_type }, { status: "active" },
                { booking_status: false }]
            }).sort({ _id: 1 }).limit(1);


            console.log(rental_vehical);
            if (rental_vehical) {
                // let alloted_vehicle =
                // {
                //     vehicle_no: rental_vehical.vehicle_no,
                //     name: rental_vehical.name,
                //     brand: rental_vehical.brand,
                //     color: rental_vehical.color,
                //     fuel_type: rental_vehical.fuel_type
                // }
                const id = await generateAutoId(); // The function call to generate auto Id
                const rentalCabAdd = new rentalCabModel({
                    _id: id,
                    user_id: req.body.user_id,
                    seater_type: req.body.seater_type,
                    rental_Hours: req.body.rental_Hours,
                    rental_date: req.body.rental_date,
                    rental_time: req.body.rental_time,
                    start_price: req.body.start_price,
                    vehicle_no: rental_vehical.vehicle_no
                }); //end of the rentalCabAdd
                const rentalCabSave = await rentalCabAdd.save(); // save the rental
                // To generate an otp for rental cab 
                generateRentalOTP(rentalCabSave, res);  // function call to genertate an OTP 
                const update_vehicle_status = await vehicleModel.updateOne({ _id: rental_vehical._id }, { $set: { booking_status: true } })
                // res.json({
                //     success: true,
                //     message: 'The Request for the Rental Cab Added',
                //     records: rentalCabAdd,
                //     vehicle_Record: alloted_vehicle

                // }); // res.json close
            } // close rental_vehicle
            else {
                res.json({
                    success: true,
                    message: `The ${seater_type} seater vehicle is not avaible for rental request `
                })
            }
        }// if 
        else {
            res.json({
                success: true,
                message: `This user ${user_id} cant Exist`,

            })
        }//else 

    } // end of the try
    catch (error) {
        console.log("rental Cab Add Error ", error);
        res.json({
            success: false,
            message: error.message
        })
    }//end of the catch 
} // rentalCabAdd 


const generateRentalOTPAutoID = async (req, res) => {
    try {
        const rentalOTPCount = await rentalOTPVerifyModel.find().count();
        let otp_id = 0;
        if (rentalOTPCount == 0) {
            otp_id = 32110;
        }
        else {
            const otp_record = await rentalOTPVerifyModel.findOne().sort({ _id: -1 }).limit(1);
            otp_id = Number(otp_record._id);
            otp_id = otp_id + 1;

        }
        return otp_id.toString();
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            error: error.message
        })
    }
}
// Function definition to generate an OTP for rental cab 

const generateRentalOTP = async ({ _id, status, vehicle_no }, res) => {
    try {
        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const rental_OTP_id = await generateRentalOTPAutoID();
        console.log("OTP pppp")
        const rentalOTP = new rentalOTPVerifyModel({
            _id: rental_OTP_id,
            rental_id: _id,
            otp: otp
        })
        const rentalOTPRecord = await rentalOTP.save();
        res.json({
            message: "Verification OTP send for rental Cab",
            otp: otp,
            rental_id: _id,
            status: status,
            vehicle_no: vehicle_no
        })

    } // end of the try 
    catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        });
    }  // end of the catch 
} // generateRentalOTP close 


//To Verify Rental OTP
const verifyRentalCabOTP = async (req, res) => {
    try {
        const _id = req.params._id;
        const rental_id = _id;
        const chk_data = await rentalCabModel.findOne({ _id });
        if (chk_data) {
            
            const is_verify = await rentalOTPVerifyModel.findOne({ $and: [{ rental_id: _id }, { status: true }] });
            if (is_verify) {
                res.json({
                    success: true,
                    message: `This OTP ${user_otp} is already verified`
                })
            }
            else {
                
                var otp_verify = await rentalOTPVerifyModel.findOne({rental_id:rental_id});
                console.log(otp_verify);
                const expiresOTP = otp_verify.expiresAt;
                if (expiresOTP < Date.Now) {
                    res.json({
                        success: true,
                        message: `otp ${otp} expires......resend it again..`
                    })
                }
                else {


                    const otp = otp_verify.otp;
                    const user_otp = req.body.otp;
                    console.log(otp_verify,otp);
                    
                    
                    if (user_otp == otp) {
                        const update_status = await rentalOTPVerifyModel.findOneAndUpdate({ rental_id: _id }, { status: true }, { verifyAt: Date.Now }, { new: true });
                        const vehicle_no = chk_data.vehicle_no;
                        const booking_status = await vehicleModel.findOneAndUpdate({ vehicle_no: vehicle_no }, { booking_status: true }, {
                            new: true
                        });
                        const rental_status = await rentalCabModel.findByIdAndUpdate({ _id }, { status: "Running" }, {
                            new: true
                        });
                        res.json({
                            success: true,
                            message: "otp verifies successfully......go ahead"
                        });
                    }

                    else {
                        res.json({
                            success: true,
                            message: "otp cant match.....try again"
                        });
                    }
                }

            }
        }
        else {
            res.json({
                success: true,
                message: `Cant find ID:${_id} rental cab details `
            })
        }
    }
    catch (error) {
        console.log("Verify Rental Cab error:", error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

//To list all the rental Cab Request  
const listRentalCab = async (req, res) => {
    try {
        const rentalData = await rentalCabModel.aggregate([{
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "myuser"
            }
        }]);

        res.json({
            success: true,
            message: "The list of all requested rental cab ride",
            record: rentalData
        });

    }//end of the try 
    catch (error) {
        console.log("List Rental error ", error);
        res.json({
            success: false,
            message: error.message,
        });
    } // end of the catch 
} // listrentalcab close 


// This is an api to send the cuurent location of the user who make a rental request
let generateLocationId = async (req, res) => {
    try {

        let location_id = 0;
        let rentalLocation = await locationModel.count();
        if (rentalLocation == 0)  // the database table is empty 
        {
            location_id = 57011;

        }
        else {
            let location_idd = await locationModel.findOne().sort({ _id: -1 }).limit(1);
            location_id = Number(location_idd._id);
            location_id = location_id + 1;

        }
        return location_id.toString();

    } // try 
    catch (error) {
        console.log("An Auto Generate Id:", error)
    } // catch 
}


// the Method to find the current location lat long 
var getCurrentLocation = async () => {
    // get the end point of current location from ip-api
    const location = fetch("http://ip-api.com/json/?fields=61439");
    let mylocation = (await location).json()
    return mylocation
}


// An Api to enter the current location dynamically
const enterCurrentLocation = async (req, res) => {
    try {
        const rental_id = req.params._id;
        const isloc = await locationModel.findOne({ rental_id: rental_id });
        if (!isloc) {

            const iscab = await rentalCabModel.findOne({ _id: rental_id });

            if (iscab) {

                let currLoc = await getCurrentLocation();
                const _id = await generateLocationId()
                console.log("The Current Location is\n", currLoc);
                const myLocation = new locationModel({
                    _id: _id,
                    rental_id: rental_id,
                    location: {
                        type: "Point",
                        coordinates: [parseFloat(currLoc.lon), parseFloat(currLoc.lat)]
                    }
                })
                const updtlocation = myLocation.save();
                // const updtlocation = rentalCabModel.updateOne({ _id: _id },{ $set: { "locations.$.type": "Point","locations.$.coordinates":[parseFloat(lat),parseFloat(long)]} },{new:true});
                console.log("Updated");

                res.json({
                    success: true,
                    message: "The Current Location updates is",
                    location: updtlocation
                });
            }
            else {
                res.json({
                    success: true,
                    message: `This _id ${rental_id} rental booking cant exist`
                })
            }//else close 
        }// if close isloc
        else {
            res.json({
                success: true,
                message: `The Rental Id ${rental_id} locations already added`
            });
        }

    }
    catch (error) {
        res.json({
            success: false,
            messageeee: error.message
        });
    }
}  // current location close 


// Enter the location manually 
const enterManualLocation = async (req, res) => {
    try {
        const rental_id = req.params._id;
        const isloc = await locationModel.findOne({ rental_id: rental_id });
        if (!isloc) {

            const iscab = await rentalCabModel.findOne({ _id: rental_id });

            if (iscab) {

                let currLoc = await getCurrentLocation();
                const _id = await generateLocationId()
                console.log("The Current Location is\n", currLoc);
                const myLocation = new locationModel({
                    _id: _id,
                    rental_id: rental_id,
                    location: {
                        type: "Point",
                        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
                    }
                })
                const updtlocation = myLocation.save();
                // const updtlocation = rentalCabModel.updateOne({ _id: _id },{ $set: { "locations.$.type": "Point","locations.$.coordinates":[parseFloat(lat),parseFloat(long)]} },{new:true});
                console.log("Updated");

                res.json({
                    success: true,
                    message: "The Current Location updates is",
                    location: updtlocation
                });
            }
            else {
                res.json({
                    success: true,
                    message: `This _id ${rental_id} rental booking cant exist`
                })
            }//else close 
        }// if close isloc
        else {
            res.json({
                success: true,
                message: `The Rental Id ${rental_id} locations already added`
            });
        }

    }
    catch (error) {
        res.json({
            success: false,
            messageeee: error.message
        });
    }
}


//To Cancel the Rental Ride of given _id
const cancelRentalRide = async (req, res) => {
    try {
        const _id = req.params._id;
        const is_rental = await rentalCabModel.findOne({ _id });
        if (is_rental) {
            //change vehicle booking status to false  
            let vehicle_no = is_rental.vehicle_no;

            const rental_id = is_rental._id;
            // console.log("The Vehicle Number:", vehicle_no);
            // const vehicle_detail = await vehicleModel.findOne({ vehicle_no: vehicle_no });
            // const v_id = vehicle_detail._id;
            // console.log(vehicle_detail);
            // console.log(vehicle_detail._id);
            const update_booking = await vehicleModel.findOneAndUpdate({ vehicle_no: vehicle_no }, { $set: { booking_status: false } },
                {
                    new: true
                });
            const delete_location = await locationModel.deleteOne({ rental_id });
            const rental_status = await rentalCabModel.findByIdAndUpdate({ _id }, { $set: { status: false } });
            res.json({
                success: true,
                message: `The rental _id ${_id} has been cancels successfully`,
                cancelRecord: is_rental
            })

        }//if close 
        else {
            res.json({
                success: true,
                message: `This Rental_Id ${_id} cant exist..enter correct _id`
            });
        } // else close 
    } // try close 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,

        });
    } // catch close 
} // close cancelRentalRide


module.exports =
{
    rentalCabAdd,
    listRentalCab,
    enterCurrentLocation,
    enterManualLocation,
    cancelRentalRide,
    verifyRentalCabOTP
}