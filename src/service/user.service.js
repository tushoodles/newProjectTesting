const errorCodes = require("../error/error.Types");
const User = require("../models/user.schema");

class UserService{
    constructor(){

    }

    
    async getuserdetail(email){
        try{
            const user = await User.findOne({email:email}).
            select('-password -salt').
            exec();
            if(!user){
                errorCodes.NOT_FOUND.status,
                errorCodes.NOT_FOUND.message
            }

            return user;

        }catch(error){
            throw(error)
        }
    }


    async connectUser(){
        try{
        }catch(error){
            throw(error)
        }
    }
}

module.exports = UserService;