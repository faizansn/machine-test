const router = require("express").Router();
const { errorWrapper } = require("../../utils/errorWrapper");

const {
  insertUser,
  retrieveUser,
  retrieveUserById,
  modifyUser,
  removeUser,
} = require("../controllers/user");
const checkAuth = require("../middleWare/checkAuth");
const { checkPermission } = require("../middleWare/checkPermission");

router.post("/", errorWrapper(insertUser));
router.get("/", checkAuth, checkPermission, errorWrapper(retrieveUser));
router.get("/:id", checkAuth, checkPermission, errorWrapper(retrieveUserById));
router.put("/:id", checkAuth, checkPermission, errorWrapper(modifyUser));
router.delete("/:id", checkAuth, checkPermission, errorWrapper(removeUser));

module.exports = router;
