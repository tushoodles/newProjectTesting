const moment = require("moment");
const redis = require("redis");
const RedisClient = require("../utils/redis.client");
const User = require("../models/user.schema");
const logger = require("log4js").getLogger("rate_service");

const WINDOW_SIZE_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 5;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

const customRedisRateLimiter = async (req, res, next) => {
  try {
    let ip = null;
    if (req.ip === "::1") {
      ip = "127.0.0.6";
    }

    if (!RedisClient) {
      throw new Error("Redis client does not exist!");
      process.exit(1);
    }

    const record = await RedisClient.get(ip);
    const currentRequestTime = moment();

    if (record == null) {
      let newRecord = [];
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      };
      newRecord.push(requestLog);

      await RedisClient.set(ip, JSON.stringify(newRecord));
      return next(); 
    }

    let data = JSON.parse(record);
    let windowStartTimestamp = moment()
      .subtract(WINDOW_SIZE_IN_HOURS, "hours")
      .unix();

    let requestsWithinWindow = data.filter((entry) => {
      return entry.requestTimeStamp > windowStartTimestamp;
    });

    let totalWindowRequestsCount = requestsWithinWindow.reduce(
      (accumulator, entry) => {
        return accumulator + entry.requestCount;
      },
      0
    );

    
    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
        return res
            .status(429)
            .json({
                message: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`
            });

    } else {
      let lastRequestLog = data[data.length - 1];
      let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
        .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, "hours")
        .unix();

      if (
        lastRequestLog.requestTimeStamp >
        potentialCurrentWindowIntervalStartTimeStamp
      ) {
        lastRequestLog.requestCount++;
        data[data.length - 1] = lastRequestLog;
      } else {
        data.push({
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1,
        });
      }

      await RedisClient.set(ip, JSON.stringify(data)); 
      return next();
    }
  } catch (error) {
    console.log("error", error);
    next(error); 
  }
};

module.exports = customRedisRateLimiter;
