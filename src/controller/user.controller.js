const errorCodes = require('../error/error.Types');
const { HTTPException } = require('../error/errorHTTPException');
const UserService = require('../service/user.service');
const { validemail } = require('../validator/auth.validator');

class UserController{
    constructor(){
        this.userservice = new UserService()
    }
    async getdetail(req,res,next){
        try{
            const email =  req.body.email;
            const data = await this.userservice.getuserdetail(email);
            return res.status(200).json({message:'Successfully User found', data:data})
        }catch(error){
            next(error)
        }
    }

    async connectUser(req,res,next){
        try{
            const data = await this.userservice.connectUser();
            return res
            .status(200).
            json({message:'User Connected Successfully', data:data})
        }catch(error){
            next(error)
        }
    }
}

module.exports = UserController