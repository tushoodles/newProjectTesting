const RedisClient = require("../utils/redis.client.js");
const User = require("../models/user.schema.js");
const { v4: uuidv4 } = require("uuid");
const { HTTPException } = require("../error/errorHTTPException.js");
const errorCodes = require("../error/error.Types.js");
const { validatelogin, validemail } = require("../validator/auth.validator.js");
const { SendMail } = require("../utils/mail.handler.js");
const generateOTP = require("../utils/otp.handler.js");
const authUser = require("../models/2fa.secret");
const speakeasy = require("speakeasy");
const crypto = require("crypto");
const QRCode = require("qrcode");



class AuthService {
  constructor() {
    this.redisClient = RedisClient.getClient();
  }

  async signup(signUpDetail) {
    try {
      const user = await User.findOne({ email: signUpDetail.email });
      if (user) {
        throw new HTTPException(
          errorCodes.CONFLICT.status,
          errorCodes.CONFLICT.message[0]
        );
      }
      const { error } = validatelogin({
        email: signUpDetail.email,
        password: signUpDetail.password,
      });
      if (error) {
        throw new HTTPException(
          errorCodes.UNAUTHORIZED.status,
          error.details[0].message
        );
      }
      const newuser = new User({
        name: signUpDetail.name,
        email: signUpDetail.email,
        usertype: signUpDetail.usertype,
        password: signUpDetail.password,
      });

      const result = await newuser.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async loginUp(logindetail) {
    try {
      const { error } = validatelogin(logindetail);
      if (error) {
        throw new HTTPException(
          errorCodes.UNAUTHORIZED.status,
          error.details[0].message
        );
      }

      const userexist = await User.findOne({ email: logindetail.email }).exec();
      if (!userexist) {
        throw new HTTPException(
          errorCodes.NOT_FOUND.status,
          errorCodes.NOT_FOUND.message
        );
      }

      const passwordMatched = userexist.passwordMatched(logindetail.password);
      if (!passwordMatched) {
        throw new HTTPException(
          errorCodes.UNAUTHORIZED.status,
          errorCodes.UNAUTHORIZED.message[0]
        );
      }
      const token = userexist.generateAuthToken();
      const data = {
        token: token,
        success: true,
      };
      return data;
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(forgetdetail) {
    try {
      const { error } = validemail(forgetdetail);
      if (error) {
        throw new HTTPException(
          errorCodes.UNAUTHORIZED.status,
          error.details[0].message
        );
      }
      const findUser = await User.findOne({ email: forgetdetail.email });
      if (!findUser) {
        throw new HTTPException(
          errorCodes.NOT_FOUND.status,
          errorCodes.NOT_FOUND.message
        );
      }

      const otp = generateOTP();
      const hashedOtp = crypto
        .createHash("sha256")
        .update(String(otp))
        .digest("hex");
      try {
        await RedisClient.set(findUser.email, hashedOtp, 180);
      } catch (redisError) {
        throw new HTTPException(
          errorCodes.INTERNAL_SERVER_ERROR.status,
          "Failed to process OTP. Please try again later."
        );
      }
      const mailObj = {
        email: findUser.email,
        otp: otp,
        purpose: "forgotpassword",
      };
      const result = await SendMail(mailObj);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async verifyotp(otpdetail) {
    const { otp, email } = otpdetail;
    const hashedOtp = await RedisClient.get(email);
    const providedHashedOtp = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");
    if (hashedOtp != providedHashedOtp) {
      return false;
    }
    return true;
  }

  async generatesecret(detail) {
    try {
      const secret = speakeasy.generateSecret({ length: 20 });
      const sec = secret.base32;
      const result = await authUser.findOneAndUpdate(
        { email: detail },
        { email: detail, twoFASecret: sec },
        { upsert: true, new: true }
      );
      const qrcode = await QRCode.toDataURL(secret.otpauth_url);
      return { sec, qrcode };
    } catch (error) {
      throw error;
    }
  }

  async verifysecret(detail) {
    try {
      const { email, token } = detail;
      const findUser = await authUser.findOne({ email: email });
      const verified = speakeasy.totp.verify({
        secret: findUser.twoFASecret,
        encoding: "base32",
        token,
      });
      return verified;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
