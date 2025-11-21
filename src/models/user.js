const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    firstName: {
        type:String,
        required :true,
        minLength : 4,
        maxLength :50
    },
    lastName: {
        type : String
    },
    emailId:{
        type : String,
        required:true,
        unique:true,
        trim:true,
        maxLength :140,
        lowercase :true
    },
    password:{
        type : String,
        required:true
    },
    age:{
        type : Number,
        min:18
    },
    gender:{
        type : String
    },
    photoUrl : {
        type : String
    },
    about :{
        type :String,
        default : "This is a dafault about of the user"
    },
    skills :{
         type :[String]
    }

})

const User = mongoose.model("User",userSchema);

module.exports = User