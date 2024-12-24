const { Server, Socket } = require('socket.io');
const logger = require('log4js').getLogger('socket-service');
const {AuthSocket} = require('../middleware/auth.socket.middleware.js');

const { 
    joinPreviousRoom,
    joinChatRoom,
    addMessageToDataBase
} = require("./handler/chat.handler.js");

const {SOCKET_EVENTS} = require('../socket/constant.event');

class WebChatSocket{
        constructor(){
            this.io= null;
        }

        async initialize(app){
            this.io = new Server(app,{
                cors:{ origin : '*',
                     methods : '*'
                    },
            });
            this.setupSocket();
        }

        //function define
        async joinPreviousRoom({socket}){
            const data = await joinPreviousRoom(socket);
        }
        async createChatRoom({obj}){
            const roomId = await joinChatRoom({obj});
            return roomId;
        }
        async  addMessageToDataBase({obj}){
            await addMessageToDataBase({obj});
        }
        async SendMessagetoRoom({socket , message , roomId, event}){
            socket.to(roomId).emit(event, message);
        }


        setupSocket(){
                //this.io.use(AuthSocket);
                this.io.on('connection',(socket)=>{
                logger.info(`New User Connected ${socket.id}`);
                socket.user='67640bfb7a85d02639eae343';
                //console.log("socket", socket);
                // this.joinPreviousRoom({socket});
                
                socket.on(SOCKET_EVENTS.JOIN_CHAT,async(data)=>{
                    // this.io.emit('listen', data);
                    const obj = { socket:socket ,data:data, recipientId: '-Qd-YiQ8qbzdccj2AAAH' };
                    
                    const roomId = await this.createChatRoom({obj});
                    console.log("roomId", roomId);
                    return roomId;
                });

                socket.on(SOCKET_EVENTS.SEND_MESSAGE,async(data)=>{
                    const obj = {socket:socket , data:data, roomId:'d9faeb73aa4f63c49f780d1b96c4051f' }
                    this.addMessageToDataBase({
                        obj
                    })

                    await this.SendMessagetoRoom({
                        socket,
                        message:data.message,
                        roomId:data.roomId,
                        event:SOCKET_EVENTS.RECEIVE_MESSAGE
                    })
                
                })

                socket.on('error',(err)=>{
                    logger.error(`socket err ${err}`)
                });

                socket.on('disconnect',()=>{
                    logger.info(`User ${socket.id} is disconnected`);
                })
            });
            this.io.on('connection_error',(error)=>{
                logger.info(error.message);
            })

            logger.info('Socket.IO Server is Running Waiting for connection...')

        }
}

const webChatSocket = new WebChatSocket();
module.exports = {webChatSocket};