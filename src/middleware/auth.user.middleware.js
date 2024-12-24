const { JWT_SECRET_KEY } = require("../../config/env");
const User = require("../models/user.schema");
const jwt = require("jsonwebtoken");
const { HttpException, HTTPException } = require("../error/errorHTTPException");
const errorType = require("../error/error.Types");

async function authToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new HttpException(401, "Authorization header missing.");
    }

    let token = authHeader.split(" ")[1];

    if (!token) {
      throw new HttpException(401, "Token missing in authorization header.");
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    console.log("decode", decoded);
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new HttpException(
        errorType.NOT_FOUND.status,
        errorType.NOT_FOUND.message || "User not found."
      );
    }
    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in authToken middleware:", error.message);
    next(error);
  }
}

const userAccessmiddlware = (req, res, next) => {
  try {
    const allowedUserTypes = ["ADMIN", "MANAGER", "OWNER"];
    if (!allowedUserTypes.includes(req?.user?.usertype)) {
      const message = Array.isArray(errorType.UNAUTHORIZED.message)
        ? errorType.UNAUTHORIZED.message.join(", ")
        : errorType.UNAUTHORIZED.message;
        
      throw new HTTPException(errorType.UNAUTHORIZED.status, message);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports ={ authToken,
  userAccessmiddlware
};
