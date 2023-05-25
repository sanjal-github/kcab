const rentalCabModel = require("../models/rentalBooking");
const userModel = require("../models/users");
const locationModel = require("../models/rentalLocation");
const vehicleModel = require("../models/vehicles");
const vehicle = require("../models/vehicles");
const rentalOTPVerifyModel = require("../models/rentalOTPVerify");
const rentalCabCompleteModel = require("../models/rental_cab_completed");
const fareModel = require("../models/fare");
const rentalPayModel = require("../models/rental_payment");


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
        //console.log("OTP pppp")
        const otpCreate = new Date(Date.now()); // otp generated time
        const otpExpires = new Date(otpCreate.getTime() + 2 * 60000) // otp expires after 2 minutes
        const rentalOTP = new rentalOTPVerifyModel({
            _id: rental_OTP_id,
            rental_id: _id,
            otp: otp,
            createdAt: otpCreate,
            expiresAt: otpExpires
        })
        const rentalOTPRecord = await rentalOTP.save();
        res.json({
            message: "Verification OTP send for rental Cab valid only for 2 minutes",
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
        const is_otp_exist = await rentalOTPVerifyModel.findOne({
            $and: [{ _id }, { status: false }
                , { book_status: "booked" }]
        });
        console.log(is_otp_exist);
        if (is_otp_exist) {
            const otp = req.body.otp;
            const rental_id = is_otp_exist.rental_id;
            const otp_expires = is_otp_exist.expiresAt;
            const dt = new Date(Date.now()); // The date and time when otp verifies
            console.log(rental_id);
            if (dt < otp_expires) {

                const is_otp_match = await rentalOTPVerifyModel.findOne({ $and: [{ _id: _id }, { otp: otp }] });
                if (is_otp_match) {
                    //Changing the status in the otp Verifying Model 
                    const otp_verify_date = new Date(Date.now());

                    const update_status = await rentalOTPVerifyModel.findOneAndUpdate({ _id },
                        {
                            $set: { status: true, book_status: "running", verifyAt: otp_verify_date }
                        },

                        {
                            new: true
                        })
                    // Updating the status in rental cab model
                    const update_cab_status = await rentalCabModel.updateOne({ _id: rental_id }, { $set: { status: "Running" } },
                        {
                            new: true
                        })
                    res.json({
                        success: true,
                        message: 'otp successfully verify'
                    })


                }//is_otp_match
                else {
                    res.json({
                        success: true,
                        message: 'otp cant match'
                    })
                }
            }// if(dt<expiresAt)
            else {
                const update_status = await rentalOTPVerifyModel.findByIdAndUpdate({ _id },
                    { $set: { book_status: "otp_expires" } },
                    {
                        new: true
                    });
                const rental_cab = await rentalCabModel.findOneAndUpdate({ _id: rental_id },
                    {
                        $set: { status: "otp_expires" }
                    },
                    {
                        new: true
                    });

                let vehicle_no = rental_cab.vehicle_no;
                //since an otp expires so unbboked the vehicle 
                const vehicle_status = await vehicleModel.findOneAndUpdate({ vehicle_no },
                    {
                        $set: { booking_status: false }
                    },
                    {
                        new: true
                    })
                res.json({
                    success: true,
                    message: "otp expires"
                })
            }
        } //if otp_exist
        else {
            res.json({
                success: true,
                message: `otp verification record of ${_id} cant exist or been already verified`
            })

        }
    } //try
    catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })

    } //catch
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
            const rental_status = await rentalCabModel.findByIdAndUpdate({ _id }, { $set: { status: "Cancelled" } });
            const update_otp = await rentalOTPVerifyModel.updateOne({ rental_id },
                {
                    $set: { book_status: "cancelled" }
                },
                {
                    new: true
                });
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

//------------------------------------------------------------------------------------------


//An API rental cab completion 

let generateCabCompleteAutoId = async (req, res) => {
    try {

        let completion_id = 0;
        let cabCount = await rentalCabCompleteModel.count();
        if (cabCount == 0)  // the database table is empty 
        {
            completion_id = 17011;

        }
        else {
            let completion_idd = await locationModel.findOne().sort({ _id: -1 }).limit(1);
            completion_id = Number(completion_idd._id);
            completion_id = completion_id + 1;

        }
        return completion_id.toString();

    } // try 
    catch (error) {
        console.log("An Auto Generate Id:", error)
    } // catch 
}

//The method to find the difference in hours between 2 dates 
function diff_hours(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));

}

const rentalCabComplete = async (req, res) => {
    try {
        let _id = req.params._id;
        console.log(_id)
        console.log("An Id is ", _id)

        const otp_verify = await rentalOTPVerifyModel.findOne({ $and: [{ _id: _id }, { book_status: "running" }] });
        console.log(otp_verify);
        if (otp_verify) {
            const cab_id = await generateCabCompleteAutoId(); // fnc call to generate auto id 
            const rental_id = otp_verify.rental_id;
            const otp_verify_At = otp_verify.verifyAt; // the date and time of opt verification
            const rental_cab_dtls = await rentalCabModel.findOne({ _id: rental_id });
            const vehicle_noo = rental_cab_dtls.vehicle_no;

            //get the details of thr booked vehicle 
            const vehicle_dtls = await vehicleModel.findOne({ vehicle_no: vehicle_noo });

            //extracting the seater type and fuel type
            let seater_type = vehicle_dtls.seater_type;
            let fuel_type = vehicle_dtls.fuel_type;
            console.log(seater_type, fuel_type);

            const fare_dtls = await fareModel.findOne({ $and: [{ seater_type: seater_type }, { fuel_type: fuel_type }] });
            rental_fare = fare_dtls.rental_fare;
            console.log("The REntal Fare is:", rental_fare);
            const completedAt = new Date(Date.now());
            console.log(`Verify ${otp_verify_At} and Complete At ${completedAt}`);
            //calculate total hours between start and completion
            const hours = diff_hours(otp_verify_At, completedAt);
            
            //calculating total fare according to hours and rental fare per hour 
            const total_fare = rental_fare * hours;
            
            
            const complete_ride = new rentalCabCompleteModel({
                _id: cab_id,
                verify_id: otp_verify._id,
                completedAt: completedAt,
                total_hour: hours,
                total_payment: total_fare
            })

            // Saving it to the mongoose 
            const save_complete_ride = await complete_ride.save();
            const updt_otp_status = await rentalOTPVerifyModel.findOneAndUpdate({ _id: otp_verify._id },
                {
                    $set: { book_status: "completed" }
                },
                {
                    new: true
                })
            //updating the status in rental cab model 
            const _id = otp_verify.rental_id;
            const update_rental_status = await rentalCabModel.findByIdAndUpdate({ _id: _id },
                { status: "Completed" },
                {
                    new: true
                })
            //update vehicle booking status 
            const vehicle_no = update_rental_status.vehicle_no;
            const update_vehicle_status = await vehicleModel.updateOne({ vehicle_no },
                {
                    "booking_status": false
                },
                {
                    new: true
                })

            makePayment(save_complete_ride, res); // move to the payment api 

            // // res.json({
            // //     success: true,
            // //     message: `The ${_id} rental cab ride completed`,

            // })
        } //if 
        else {

            res.json({
                success: true,
                message: `${_id} otp verification record doesnt exist or not in running state`

            })
        } //else

    }//try
    catch (error) {
        console.log("Cab Comp error:",error);
        res.json({
            success: false,
            message: error.message
        })
    }  //catch
} // rentalCabComplete

// The method to make the payment 

const autoGeneratePaymentId = async () => {
    try {

        let payment_id = 0;
        let payCount = await rentalPayModel.count();
        if (payCount == 0)  // the database table is empty 
        {
            payment_id = 56011;

        }
        else {
            let payment_idd = await rentalPayModel.findOne().sort({ _id: -1 }).limit(1);
            payment_id = Number(payment_idd._id);
            payment_id = payment_id + 1;

        }
        return payment_id.toString();

    } // try 
    catch (error) {
        console.log("An Auto Generate Id:", error)
    } // catch 
}
const makePayment = async ({ _id, total_payment }, res) => {
    try {

        const id = await autoGeneratePaymentId();
        const create_pays = new rentalPayModel({
            _id: id,
            complete_id: _id,
            total_payment: total_payment
        });

        const pay_me = await create_pays.save();
        res.json({
            message: `The ${_id} Rental Ride Completes`,
            complete_id: _id,
            total_payment: total_payment,
            status: "unpaid"
        })

    }
    catch (error) {
        console.log("payment error:", error);
        res.json({
            success: false,
            message: error.message
        })
    }

}

module.exports =
{
    rentalCabAdd,
    listRentalCab,
    enterCurrentLocation,
    enterManualLocation,
    cancelRentalRide,
    verifyRentalCabOTP,
    rentalCabComplete,

}