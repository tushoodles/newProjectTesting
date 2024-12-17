const errorType = require("../error/error.Types");
const { HTTPException } = require("../error/errorHTTPException");
const AuthService = require("../service/auth.service.js");
const logger = require("log4js").getLogger("auth_controller");
const {validatelogin} = require("../validator/auth.validator.js");


class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async signUp(req, res, next) {
    try {
      const data = await this.authService.signup(req.body);
      res
        .status(200)
        .json({ message: "User Created Successfully", data: data });
    } catch (error) {
      next(error);
    }
  }

  async loginUp(req, res, next) {
    try {
      const data = await this.authService.loginUp(req.body);
      console.log("data",data);
      res.
      status(200)
      .json({message:"Successfully login", data:data});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
