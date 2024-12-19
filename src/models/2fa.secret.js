const mongoose = require("mongoose");

const authUser = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
    },
    twoFASecret:{
        type:String
    }
})

module.exports = mongoose.model('userAuth',authUser);