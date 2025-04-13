const router = require("express").Router();
const { errorWrapper } = require("../../utils/errorWrapper");
const checkAuth = require("../middleWare/checkAuth");

const {
  insertRole,
  retrieveRole,
  retrieveRoleById,
  modifyRole,
  removeRole,
} = require("../controllers/role");
const { createRoleValidator, updateRoleValidator } = require("../../validators/role");
const { checkPermission } = require("../middleWare/checkPermission");

router.post("/", checkAuth, checkPermission, createRoleValidator, errorWrapper(insertRole));
router.get("/", checkAuth, checkPermission, errorWrapper(retrieveRole));
router.get("/:id", checkAuth, checkPermission, errorWrapper(retrieveRoleById));
router.put("/:id", checkAuth, checkPermission, updateRoleValidator, errorWrapper(modifyRole));
router.delete("/:id", checkAuth, checkPermission, errorWrapper(removeRole));

module.exports = router;
