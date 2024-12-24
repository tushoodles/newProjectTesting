const mongoose = require('mongoose');


const roomSchema  = new mongoose.Schema({
    participant:[
        {
            type:String,
            required:true,
        },
    ],
    roomId:{
        type:String,
        required:true,
        unique:true,
    }
},{
    timeStamp:true,
});


const Room = mongoose.model('Room', roomSchema);
module.exports = Room;