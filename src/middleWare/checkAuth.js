const jwt = require("jsonwebtoken");
const db = require("../models");
const {
  ValidationError,
  UnauthorizedError,
} = require("../../utils/customError");
const { JWT_SECRET } = require("../../utils/constant");
const response = require("../../utils/response");

const { promisify } = require("util");
const redisClient = require("../../utils/redis");

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

module.exports = async (req, res, next) => {
  try {
    const checkToken = req.headers.authorization;
    if (!checkToken) {
      return response.unauthorized(res);
    } else {
      let token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return response.unauthorized(res);
      }
      const decode = jwt.verify(token, JWT_SECRET || process.env.JWT_SECRET);
      if (decode) {

        let cachedUser = false;
        let cachedToken = false;
       // Check for the token in the DB
        // const cachedToken = redisClient.connected && await GET_ASYNC(`userToken_${token}`)
          let findInDb;
          if (cachedToken) {
            findInDb = JSON.parse(cachedToken);
          } else {
            findInDb = await db.userToken.findOne({ token: token });
            if (!findInDb) {
              return response.unauthorized(res);
            }

            // Cache the token data in Redis
            // redisClient.connected && await SET_ASYNC(`userToken_${token}`, JSON.stringify(findInDb), 'EX', 60);
          }
      
        // Get user details
        // const cachedUser = redisClient.connected && await GET_ASYNC(`user_${decode.userId}`)
          let userDetails;
          if (cachedUser) {
            userDetails = JSON.parse(cachedUser);
          } else {
            userDetails = await db.user.findById(decode.userId).populate("role");
            if (!userDetails) {
              return response.unauthorized(res);
            }

            // Cache the user details in Redis
            // redisClient.connected && SET_ASYNC(`user_${decode.userId}`, JSON.stringify(userDetails), 'EX', 60);
          }

          if (userDetails) {
            req["user"] = {
              id: userDetails._id,
              firstName: userDetails.firstName,
              email: userDetails.email,
              role: userDetails.role?.name
            };
            next();
          }
        
      } else {
        return response.unauthorized(res);
      }
    }
  } catch (err) {
    return response.unauthorized(res);
  }
};

