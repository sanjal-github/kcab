const userModel = require("../models/users");
const OTPVerificationModel = require("../models/otpVerification");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");


//This is the method to generate an auto user _id
const generateAutoUserId = async (req, res) => {
    var user_id = 0;
    try {
        const userCount = await userModel.count();
        if (userCount == 0) {
            user_id = 1101;

        }//if 
        else {
            const userLastRec = await userModel.findOne().sort({ _id: -1 }).limit(1);
            user_id = userLastRec._id + 1;
        }
        return user_id;  // returning the promise 
    } // try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });

    }

}

const userRegistration = async (req, res) => {
    try {
        // checking for already registered email 
        const email = req.body.email;
        const phone = req.body.phone;
        const chkemail = await userModel.findOne({ email: email });
        if (!chkemail) {

            const chkphone = await userModel.findOne({ phone: phone });
            if(!chkphone){
            //śince generateAutoId returning the promise so use await
            let id = await generateAutoUserId(); // function call 

            const user = new userModel({
                // The function call to generate an auto id
                _id: id,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
            });

            const userSave = await user.save();
            res.json({
                success: true,
                message: "The new user SignUp Successfully",
                record: userSave
            });
        } // if (phone)
        else 
        {
            res.json({
                success: false,
                message: "An Account with this Mobile No already exist....try else "
        })
        }  // if 
    }
        else {
            res.json({
                success: false,
                message: "An Account with this email already exist....try else "
            })
        } // else 

    }//try 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }// catch
}


// An Api for user login or signUp

const userLogin = async (req, res) => {
    try {
        const phone = req.body.phone;
        const user = await userModel.findOne({ phone });
        
        if(!user)
        {
            throw new Error("This Phone doesn't Exist..please enter registered Phone Number")
        }
        else 
        {
             generateOTP(user,res);
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

const verifyUser= async(_id)=>
{
    try
    {

    }
    catch(error)
    {
        
    }
}
// The function to generate an OTP
const generateOTP = async ({ _id }, res) => {
    try {
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const userStatus = await verifyUser(_id)        
        // const otpp = otp;
        // const saltRounds = 10;
        // const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const id = await generateAutoOtpId();
        console.log("i am waiting")
        const OTPVerification = new OTPVerificationModel({
            _id: id,
            userId:_id,
            otp: hashedOTP,
            //phone:phone,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        const sendOTP = await OTPVerification.save();

        res.json({
            status: "PENDING",
            message: "Verification OTP Send",
            otp: otpp,
            userId:_id,
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
    var otp_id = 0;
    try {
        const otpCount = await OTPVerificationModel.count();
        if (otpCount == 0) {
            otp_id = 31011;

        }//if 
        else {
            const otpLastRec = await OTPVerificationModel.findOne().sort({ _id: -1 }).limit(1);
            otp_id = otpLastRec._id + 1;
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
            const OTPVerifyRecord = await OTPVerificationModel.findOne({ userId });
            if (OTPVerifyRecord.length <= 0) {
                throw new Error("Account Record Doesn't Exist or has been Verified ")
            }   // if 
            else {
                
                const expiredAt = OTPVerifyRecord.expiredAt;
                
                const hashedOTP = OTPVerifyRecord.otp;    
                
                if (expiredAt < Date.now()) {
                    await OTPVerificationModel.deleteMany({ userId });
                    throw new Error("The OTP has Expires please send the new OTP Request");

                }//if expires 
                else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);
                    if (validOTP) {
                        const updtOTP = await OTPVerificationModel.updateOne({ userId }, { status: true });

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
    userRegistration,
    userLogin,
    verifyOTP
}   