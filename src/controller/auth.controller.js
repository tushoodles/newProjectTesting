const errorType = require("../error/error.Types");
const { HTTPException } = require("../error/errorHTTPException");
const AuthService = require("../service/auth.service.js");
const logger = require("log4js").getLogger("auth_controller");
const { validatelogin } = require("../validator/auth.validator.js");

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
      res.status(200).json({ message: "Successfully login", data: data });
    } catch (error) {
      next(error);
    }
  }

  async forgetpassword(req, res, next) {
    try {
      const mailSend = await this.authService.forgetPassword(req.body);
      const isMailSent = mailSend.accepted && mailSend.accepted.length > 0;
      return res.status(200).json({
        data: {
          message: isMailSent
            ? "Mail Sent Successfully"
            : "Mail Not Sent Successfully",
          sucess: isMailSent ? true : false,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const otpverify = await this.authService.verifyotp(req.body);
      return res.status(200).json({
        data: {
          message: otpverify
            ? "OTP verified Successfully"
            : "OTP Not Verified Successfully",
          sucess: otpverify ? true : false,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async generateSecret(req, res, next) {
    try {
      const result = await this.authService.generatesecret(req.body.email);
      return res
        .status(200)
        .json({ message: "QR code generated Sucessfully", data: result });
    } catch (error) {
      next(error);
    }
  }

  async verifySecret(req, res, next) {
    try {
      const result = await this.authService.verifysecret(req.body);
      const message = result
        ? "Verification successful"
        : "Verification failed";
      return res.status(200).json({
        message: message,
        data: {
          sucess: result,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
