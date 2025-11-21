// const mongoose = require("mongoose")

//  const connectDb  = async()=> {

//    await mongoose.connect("mongodb+srv://adilgrover1994:Fx4ylwYVCBGphtA8@namastenode.zrkuq9o.mongodb.net/?retryWrites=true&w=majority&appName=namastenode")

//  } 


//  connectDb().then(()=>{
//     console.log("db connected succesfully");
    
//  }).catch(err =>{
//     console.log("db not connected ");
//  })


// ./config/database.js
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://adilgrover1994:Fx4ylwYVCBGphtA8@namastenode.zrkuq9o.mongodb.net/devTinder?retryWrites=true&w=majority&appName=namastenode",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB connecteddddd successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err; // rethrow so app.js knows it failed
  }
};

module.exports = connectDb;
