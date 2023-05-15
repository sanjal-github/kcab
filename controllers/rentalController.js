const rentalCabModel = require("../models/rentalBooking");
const userModel = require("../models/users");
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
            rental_id = Number(rental_idd);
            rental_id = rental_id;
        }
        return rental_id.toString();

    } // try 
    catch (error) {
        console.log("An Auto Generate Id:",error)
    } // catch 
}

let rentalCabAdd = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        let chk_user = await userModel.findOne({ _id: user_id });
        if (chk_user) {
            const id = await generateAutoId(); // The function call to generate auto Id
            const rentalCabAdd = new rentalCabModel({
                _id:id,
                user_id: req.body.user_id,
                rental_Hours: req.body.rental_Hours,
                rental_date: req.body.rental_date,
                rental_time: req.body.rental_time,
                start_price: req.body.start_price
            }); //end of the rentalCabAdd
            const rentalCabSave = await rentalCabAdd.save(); // save the rental
            res.json({
                success: true,
                message: 'The Request for the Rental Cab Added',
                records: rentalCabAdd
            }); // res.json close  
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

//To list all the rental Cab Request  
const listRentalCab = async(req,res) =>
{
    try 
    {
       const rentalData = await rentalCabModel.aggregate([{$lookup:{
        from:"users",
        localField:"user_id",
        foreignField:"_id",
        as:"myuser"
       }}]);

       res.json({
        success:true,
        message:"The list of all requested rental cab ride",
        record:rentalData
       });

    }//end of the try 
    catch(error)
    {
        console.log("List Rental error ",error);
      res.json({
        success:false ,
        message:error.message,
    });   
    } // end of the catch 
} // listrentalcab close 


module.exports =
{
    rentalCabAdd,
    listRentalCab
}