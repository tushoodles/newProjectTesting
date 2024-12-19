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
    );

    this.router.get(
      `${this.path}/forget-password`,
      this.authController.forgetpassword.bind(this.authController)
    );

    this.router.post(
      `${this.path}/2fa-generate-secret`,
      this.authController.generateSecret.bind(this.authController)
    );

    this.router.get(
      `${this.path}/verify-token`,
      this.authController.verifySecret.bind(this.authController)
    )
  }
}

module.exports = AuthRoutes;
