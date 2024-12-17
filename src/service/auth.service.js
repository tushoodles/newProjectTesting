const RedisClient = require("../utils/redis.client.js");
const User = require("../models/user.schema.js");
const { v4: uuidv4 } = require("uuid");
const { HTTPException } = require("../error/errorHTTPException.js");
const errorCodes = require("../error/error.Types.js");
const { validatelogin } = require("../validator/auth.validator.js");

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
        if(!passwordMatched){
        throw new HTTPException(
            errorCodes.UNAUTHORIZED.status,
            errorCodes.UNAUTHORIZED.message[0]
          );
        }
        const token = userexist.generateAuthToken();
        const data = {
            token : token,
            success:true
        }
        return data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
