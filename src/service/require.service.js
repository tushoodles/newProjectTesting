const logger = require("log4js").getLogger("require-service");
const errorCodes = require("../error/error.Types");
const { HTTPException } = require("../error/errorHTTPException");
const User = require("../models/user.schema");
const RequireValidator = require("../validator/require.validate");

class requireService {
  constructor() {
    this.requirevalidator = new RequireValidator();
  }
  async getapprovemember(approveDetail) {
    try {
      const { error } = this.requirevalidator.validateMember(approveDetail.data);
      if (error) {
        throw new HTTPException(
          errorCodes.BAD_REQUEST.status,
          errorCodes.BAD_REQUEST.message
        );
      }
      const result = await User.findOneAndUpdate(
        { _id: approveDetail.user._id},
        { $set: { approved: true } },
        { new: true }
      );
      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

module.exports = requireService;
