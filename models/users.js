const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    _id:
    {
        type: String,
        //unique:true,
        required: true
    },
    name:
        [
            {
                firstName:
                {
                    type: String,
                    default: ""

                },
                middleName:
                {
                    type: String,
                    default: ""
                },
                lastName:
                {
                    type: String,
                    default: ""

                }
            }
        ],
    email:
    {
        type: String,
        unique:true

    },
    phone:
    {
        type: String,
        required: true,
    },
    status:
    {
        type: String,
        default: "New"
    }

},
    {
        timestamps: true
    }
)

const user = new mongoose.model("users", userSchema);

module.exports = user;
