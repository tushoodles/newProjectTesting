const { Router } = require("express");
const AuthController = require("../controller/auth.controller");

class AuthRoutes {
  constructor() {
    this.router = Router();
    this.path = "/api/v1/auth";
    this.authController = new AuthController();
    this.initializeRoutes();
  }
  
  initializeRoutes() {

    this.router.post(
      `${this.path}/signup`,
      this.authController.signUp.bind(this.authController)
    );

    this.router.post(
      `${this.path}/login`,
      this.authController.loginUp.bind(this.authController)
    )

  }
}

module.exports = AuthRoutes;
