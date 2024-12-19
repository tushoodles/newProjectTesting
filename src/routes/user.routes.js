const { Router } = require("express");
const UserController = require("../controller/user.controller"); 
const authToken = require("../middleware/auth.user.middleware");



class UserRoutes {
    constructor(){
        this.router= Router();
        this.path = '/api/v1/user'
        this.userController = new UserController();
        this.initializeRoutes();
    }

    initializeRoutes(){
        this.router.get(
            `${this.path}/getuserdetail`,this.userController.getdetail.bind(this.userController)
        )
        this.router.post(
            `${this.path}/connectwallet`, this.userController.connectUser.bind(this.userController)
        )
        

    }

    
}

module.exports = UserRoutes;
