const jwt = require("jsonwebtoken");
const errorCodes = require('../error/error.Types');
const { HTTPException } = require('../error/errorHTTPException');
const logger = require('log4js').getLogger('auth.socket.middleware');
const User = require('../models/user.schema.js');


const AuthSocket = async(socket , next)=>{
    try{
        const socketHeader = socket.handshake.headers.authorization;
        console.log("socketHeader",socketHeader);
        if(!socketHeader){
            throw  new HTTPException(
                errorCodes.UNAUTHORIZED.status,
                errorCodes.UNAUTHORIZED.message[0],
            )
        }
        const token = socketHeader.split(' ')[1];
        const decoded = Jwt.verify(token , JWT_SECRET_KEY);
        const finduser = await User.findById({_id:decoded.id});
        
        if(!finduser){
            throw new HTTPException(
                errorCodes.NOT_FOUND.status,
                errorCodes.NOT_FOUND.message
            )
        }

        socket.user = finduser
        socket.decode = decoded
        next()
    }catch(error){
        logger.error(error);        
        next(error);
    }
}

module.exports = {AuthSocket}