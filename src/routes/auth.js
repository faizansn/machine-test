const router = require("express").Router();
const { errorWrapper } = require("../../utils/errorWrapper");
const checkAuth = require("../middleWare/checkAuth");
const {
  loginUser,
  logoutUser,
  resetPassword,
  sendResetPasswordLink,
} = require("../controllers/auth");

router.post("/login", errorWrapper(loginUser));
router.post("/logout", checkAuth, errorWrapper(logoutUser));
router.post("/reset-password/:token", errorWrapper(resetPassword));
router.post(
  "/password-reset-mail",
  errorWrapper(sendResetPasswordLink)
);
module.exports = router;
