// creating the server 
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT;
const app = express();

//calling the middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//calling the routers 
app.use("/kcab",require("./routes/userRoutes"));
app.use("/kcab",require("./routes/vehicleRoutes"));
app.use("/kcab",require("./routes/driverRoutes"));
app.use("/kcab",require("./routes/rentalCabRoutes"));
app.use("/kcab",require("./routes/fareRoutes"));


//connecting from mongoose 
mongoose.connect(process.env.MONGO_URI,
    {
    dbName:process.env.DB_NAME,
    useNewUrlParser:true,
    useUnifiedTopology:true
  }).then(()=>{
    console.log("Connected to Mongo ...... Server");
    app.listen(port,()=>{
        console.log("Connected to Server at port:",port);
    })
  });

