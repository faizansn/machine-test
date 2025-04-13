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

router.post("/", checkAuth, errorWrapper(insertRole));
router.get("/", checkAuth, errorWrapper(retrieveRole));
router.get("/:id", checkAuth, errorWrapper(retrieveRoleById));
router.put("/:id", checkAuth, errorWrapper(modifyRole));
router.delete("/:id", checkAuth, errorWrapper(removeRole));

module.exports = router;
