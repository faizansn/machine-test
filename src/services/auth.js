const jwt = require("jsonwebtoken");
const db = require("../models");
const {
  ValidationError,
  NoDataFoundError,
  BadRequestError,
} = require("../../utils/customError");
const handleSuccess = require("../../utils/successHandler");
const constant = require("../../utils/constant");
require("dotenv").config();

const { JWT_SECRET } = require("../../utils/constant");
const sendEmail = require("../../utils/email");

const redisClient = require("../../utils/redis");

exports.userLogin = async (email, password) => {
  const user = await db.user.findOne({ email });
  if (!user) {
    throw new NoDataFoundError(`User not found with Email ${email}`);
  }

  const verifyPassword = await user.comparePassword(password);
  if (!verifyPassword) {
    throw new ValidationError("Invalid Password!");
  }

  const token = createToken(
    user._id,
    user.firstName || user.lastName || "thename"
  );

  const userToken = await db.userToken.findOneAndUpdate(
    { userId: user._id },
    { token },
    { new: true, upsert: true }
  );

  const userInfoAndToken = {
    userId: user._id,
    token: userToken.token,
  };

  return handleSuccess("User logged in successfully", userInfoAndToken);
};

exports.userLogout = async (userId,token) => {
  const result = await db.userToken.deleteOne({ token });

  if (result.deletedCount) {
    redisClient.connected && redisClient.del(`userToken_${token}`);
    redisClient.connected && redisClient.del(`user_${userId}`);
    redisClient.connected && redisClient.del(`user_permission_${userId}`);
    return handleSuccess("User logged out successfully");
  }
};

exports.requestResetPasswordLink = async (body) => {
  const { email } = body;
  const user = await db.user.findOne({ email });
  if (!user) {
    throw new NoDataFoundError(`User not found with Email ${email}`);
  }

  // genating reset token
  const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const resetUrl = new URL(
    `/api/auth/reset-password/${resetToken}`,
    process.env.URL || "http://localhost:3000"
  ).toString();

  const htmlContent = `
  <p style="font-family: Arial, sans-serif; color: #333; font-size: 16px; line-height: 1.5; margin: 0;">
    You requested a password reset for your account. Click the button below to reset your password. The link will expire in 15 minutes.
  </p>
  <p style="text-align: center; margin: 20px 0;">
    <a href="${resetUrl}" 
       style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 4px;">
      Reset Password
    </a>
  </p>
  <p style="font-family: Arial, sans-serif; color: #333; font-size: 16px; line-height: 1.5; margin: 20px 0 0;">
    If you did not request this password reset, please ignore this email or contact support if you have any questions.
  </p>
  <p style="font-family: Arial, sans-serif; color: #777; font-size: 14px; text-align: center; margin: 20px 0 0;">
    Thank you,<br>
    The Zenput Team<br>
    <a href="${
      process.env.URL || "http://localhost:3000"
    }" style="color: #007bff; text-decoration: none;">Visit our website</a>
  </p>
  `;

  module.exports = htmlContent;
  await sendEmail(user.email, "Password Reset", htmlContent);

  return handleSuccess("Password reset email sent.");
};

exports.resetPassword = async (path, body) => {
  const { newPassword } = body;

  path = path.split("/");
  const resetToken = path[path.length - 1];

  const decoded = jwt.verify(resetToken, JWT_SECRET);
  if (!decoded) {
    throw new BadRequestError("Invalid reset token");
  }
  const user = await db.user.findOneAndUpdate(
    { _id: decoded.userId },
    { password: newPassword }
  );

  if (!user) {
    throw new NoDataFoundError(`User not found with ID ${decoded.userId}`);
  }

  return handleSuccess("Password reset successfully");
};

const createToken = (userId, name) => {
  return jwt.sign({ userId, name }, JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN || "24h",
  });
};
