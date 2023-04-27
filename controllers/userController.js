const userModel = require("../models/users");


//This is the method to generate an auto user _id
const generateAutoId = async (req, res) => {
    var user_id = 0;
    try {
        const userCount = await userModel.count();
        if (userCount == 0) {
            console.log("hhhhh");
            user_id = 1101;

        }//if 
        else {
            const userLastRec = await userModel.findOne().sort({ _id: -1 }).limit(1);
            user_id = userLastRec._id + 1;
        }
        return user_id;
    } // try 
    catch (error) {
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
        const chkemail = await userModel.findOne({email:email});
        if (!chkemail) {

            let id=await generateAutoId(); // function call 
            
            const user = new userModel({
                // The function call to generate an auto id
                _id:id,        
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

        }  // if 
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


module.exports = {
    userRegistration
}