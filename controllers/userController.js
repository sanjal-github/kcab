const userModel = require("../models/users");
const OTPVerificationModel = require("../models/otpVerification");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");


//This is the method to generate an auto user _id
const generateAutoUserId = async (req, res) => {
    var userId = "";
    try {
        const userCount = await userModel.count();
        if (userCount == 0) {
            userId = "1101";

        }//if 
        else {
            let userLastRec = await userModel.findOne().sort({ _id: -1 }).limit(1);
            let user_Id = Number(userLastRec._id);
            user_Id = user_Id + 1;
            userId = user_Id.toString();
        }
        return userId;  // returning the promise 
    } // try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });

    }

}
const addUserInfo = async (req, res) => {
    try {
        let _id = req.body._id;
        let userData = await userModel.findOne({ _id })
        if (userData) {
            let userAddRec = await userModel.findByIdAndUpdate(_id, req.body,
                {
                    new: true
                });
            res.json({
                success: true,
                message: `The information added of id ${_id}`,
                record: userAddRec
            });

        }// if(userData)
        else {
            res.json({
                success: false,
                message: `This Id ${_id} record cant Exist`
            })
        }
    }//try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "This email Id Already Exist"
        })
    }// catch
}


// An Api for user login or signUp

const userLogin = async (req, res) => {
    try {
        const phone = req.body.phone;
        const user = await userModel.findOne({ phone });

        if (!user) {

            let id = await generateAutoUserId(); // function call 
            let newuser = new userModel({
                _id: id,
                phone: req.body.phone
            });


            let saveuser = await newuser.save();
            generateOTP(saveuser, res);
        }
        else {
            generateOTP(user, res);
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}


// The function to generate an OTP
const generateOTP = async ({ _id, status }, res) => {
    try {

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        // const otpp = otp;
        // const saltRounds = 10;
        // const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const id = await generateAutoOtpId();
        //console.log("i am waiting")
        const OTPVerification = new OTPVerificationModel({
            _id: id,
            userId: _id,
            otp: otp,
            //phone:phone,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        const sendOTP = await OTPVerification.save();

        res.json({

            message: "Verification OTP Send",
            otp: otp,
            userId: _id,
            status: status,
            //phone: phone
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// The function to generate auto otp verification _id 
const generateAutoOtpId = async (req, res) => {
    var otp_id = "";
    try {
        const otpCount = await OTPVerificationModel.count();
        if (otpCount == 0) {
            otp_id = "31011";

        }//if 
        else {
            const otpLastRec = await OTPVerificationModel.findOne().sort({ _id: -1 }).limit(1);
            let otpId = Number(otpLastRec._id)
            otpId = otpId + 1;
            otp_id = otpId.toString();
        }
        return otp_id;  // returning the promise 
    } // try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });

    }

}


// This is an api to verify the token 
const verifyOTP = async (req, res) => {
    try {
        let userId = req.body.userId;
        let otp = req.body.otp;
        if (!userId || !otp) {
            throw new Error("Wrong OTP Details are not allows");
        } // if 
        else {
            const OTPVerifyRecord = await OTPVerificationModel.find({ userId });
            if (OTPVerifyRecord.length <= 0) {
                throw new Error("Account Record Doesn't Exist or has been Verified ")
            }   // if 
            else {

                const expiredAt = OTPVerifyRecord.expiredAt;

                //const hashedOTP = OTPVerifyRecord.otp;

                if (expiredAt < Date.now()) {
                    await OTPVerificationModel.deleteMany({ userId });
                    throw new Error("The OTP has Expires please send the new OTP Request");

                }//if expires 
                else {
                    const vuser = await OTPVerificationModel.findOne({ userId, status: false });
                    const _id = vuser._id;
                    if (vuser.otp == otp) {
                        const updtOTP = await OTPVerificationModel.updateOne({ _id }, { status: true });
                        const updtStatus = await userModel.updateOne({ _id: userId }, { status: "Registered" });
                        res.json({
                            success: true,
                            message: "Login Success.......OTP Verified Successfully"
                        });
                    }
                    else {
                        throw new Error("Invalid OTP pass ......OTP Doesnt match");

                    }
                }
            } //else 

        } //else 
    } // try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    } // catch 
}
module.exports = {
    addUserInfo,
    userLogin,
    verifyOTP
}   