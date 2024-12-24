const logger = require("log4js").getLogger("chat-handler");
const Room = require("../../models/room.js");
const crypto = require("crypto");
const Chat = require("../../models/chat.js");
const { default: mongoose } = require("mongoose");

async function joinPreviousRoom({ socket }) {
  try {
    const { user } = socket.user;

    const rooms = await Room.find({
      participant: user._id,
    }).lean();

    if (rooms.length > 0) {
      rooms.forEach((room) => {
        socket.join(room.roomId);
        logger.info(`${user._id} join Room ${room.roomId}`);
      });
    } else {
      logger.info(`User ${user._id} has no room to join`);
    }
    return true;
  } catch (error) {
    logger.error(error.message);
  }
}

async function joinChatRoom({ obj }) {
    const user = obj.socket.user;
    const recipientId = obj.recipientId;
   



    let room = await Room.findOne({
        participant: { $all: [user, recipientId] },
    });

    // If no room exists, create a new one
    if (!room) {
        const roomId = crypto.randomBytes(16).toString("hex");
        room = new Room({
            roomId,
            participant: [user, recipientId],
        });

        await room.save();
    }

    return room.roomId;
}

async function addMessageToDataBase({ obj }) {
  try {
    const user = obj.socket.user;
    console.log("user", user);
    const message = obj.data;
    const roomId = obj.roomId;

    const newMessage = new Chat({
      sender: user,
      message: message,
      roomId: roomId,
    });

    await newMessage.save();

    if (newMessage) {
      logger.info(`New message ${newMessage._id} is Saved in ${roomId}`);
      return true;
    }

    return false;
  } catch (error) {
    logger.error(error.message);
    return false;
  }
}

module.exports = { joinPreviousRoom, joinChatRoom, addMessageToDataBase };
