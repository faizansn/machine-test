const router = require("express").Router();
const { errorWrapper } = require("../../utils/errorWrapper");
const checkAuth = require("../middleWare/checkAuth");

const {
  insertPermission,
  retrievePermission,
  retrievePermissionById,
  modifyPermission,
  removePermission,
} = require("../controllers/permission");

const { checkPermission } = require("../middleWare/checkPermission");

router.post("/", checkAuth, checkPermission, errorWrapper(insertPermission));
router.get("/", checkAuth, checkPermission, errorWrapper(retrievePermission));
router.get("/:id", checkAuth, checkPermission, errorWrapper(retrievePermissionById));
router.put("/:id", checkAuth, checkPermission, errorWrapper(modifyPermission));
router.delete("/:id", checkAuth, checkPermission, errorWrapper(removePermission));

module.exports = router;
