const {
  userLogin,
  userLogout,
  resetPassword,
  requestResetPasswordLink,
} = require("../services/auth");
const response = require("../../utils/response");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const loggedInUser = await userLogin(email, password);
  return response.ok(res, loggedInUser);
};

exports.logoutUser = async (req, res) => {
  const userId = req.user.id;
  const token = req.headers.authorization.split(' ')[1]
  const loggedOutUser = await userLogout(userId,token);
  return response.ok(res, loggedOutUser);
};

exports.sendResetPasswordLink = async (req, res) => {
  const sendEmail = await requestResetPasswordLink(req.body);
  return response.ok(res, sendEmail);
};

exports.resetPassword = async (req, res) => {
  const resetPass = await resetPassword(req.path, req.body);
  return response.ok(res, resetPass);
};
