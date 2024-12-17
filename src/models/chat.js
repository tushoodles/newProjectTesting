const mongoose = require('mongoose');


const chatSchema  = mongoose.Schema({
    roomId:{
        type:String,
        required:true,
        unique:true,
    },
    sender:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    }
},{
    timeStamp:true,
});



chatSchema.index({roomId:1});
const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;