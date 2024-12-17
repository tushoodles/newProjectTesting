const logger = require("log4js").getLogger('chat-handler');
const Room = require('../../models/room.js');
const crypto = require('crypto');
const Chat = require('../../models/chat.js');

async function joinPreviousRoom({socket}){
    try{
        const { user } = socket.user;

        const rooms = await Room.find({
            participant:user._id
        }).lean();


        if(rooms.length > 0){
           rooms.forEach((room)=>{
            socket.join(room.roomId);
            logger.info(`${user._id} join Room ${room.roomId}`)
           })
        }else{
            logger.info(`User ${user._id} has no room to join`);
        } 
        return true;
    }catch(error){
        logger.error(error.message)
    }
}

async function joinChatRoom({socket , data}){
    const user = socket.user;
    const { recipientId } = data;

    let room = await Room.findOne({
        participant:{$all: [user , recipientId ]},
    });

    if(!room){
        const roomId= await crypto.randomBytes(16).toString('hex');

        room =  Room.create({
            roomId,
            participant:[user , recipientId ],
        });

        await room.save();
    }

    return room.roomId;
}

async function addMessageToDataBase({socket , data}){
    try{
        const user  = socket.user;
        const message = data.message;
        const roomId = data.roomId;

        const newMessage = new Chat.create({
            sender:user._id,
            message:message,
            roomId:roomId,
        });

        await newChat.save();

        if(newMessage){
            logger.info(`New message ${newMessage._id} is Saved in ${roomId}`);
            return true;
        }

        return false;
    }catch(error){
        logger.error(error.message);
        return false;
    }
}

module.exports = {joinPreviousRoom , joinChatRoom , addMessageToDataBase}