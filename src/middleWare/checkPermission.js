const db = require("../models");

const { promisify } = require("util");
const redisClient = require("../../utils/redis");

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

exports.checkPermission = async (req, res, next) => {
  // temporarily commenting check permission middle due to redis connection error on free host.
  next();
  // try{// getting user details
  // console.log("Seo")

  // // const cachedUser = redisClient.connected && await GET_ASYNC(`user_permission_${req["user"].id}`)
  // let cachedUser = false
  // console.log("Seo")
  // let userDetails;
  // if (cachedUser) {
  //   userDetails = JSON.parse(cachedUser);
  // } else {
  //   userDetails = await db.user
  //   .findOne({ _id: req["user"].id })
  //   .populate({
  //     path: "role",
  //     populate: {
  //       path: "permissions",
  //     },
  //   })
  //   .lean();
  //   if (!userDetails) {
  //     return response.unauthorized(res);
  //   }

  //   // caching the user details in redis
  //   // redisClient.connected && SET_ASYNC(`user_permission_${req["user"].id}`, JSON.stringify(userDetails), 'EX', 120);
  // }

  // const permissions = userDetails.role.permissions;
  // let hasPermissions = false;
  // for (let permission of permissions) {
  //   if (
  //     permission.method === req.method &&
  //     permission.baseUrl === req.baseUrl &&
  //     permission.path === req.route.path
  //   ) {
  //     hasPermissions = true;
  //     break;
  //   }
  // }

  // if (!hasPermissions) {
  //   return res.status(401).json({ message: "Permission denied" });
  // }
  // next();}
  // catch(err){
  //   console.log(err)
  // }
};
