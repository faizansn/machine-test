const router = require("express").Router();
const { errorWrapper } = require("../../utils/errorWrapper");
const { modifyNotificationById, modifyNotification, retrieveAllNotification, retrieveNotificationById } = require("../controllers/notification");
const checkAuth = require("../middleWare/checkAuth");

router.get("/", checkAuth, errorWrapper(retrieveAllNotification));
router.put("/", checkAuth, errorWrapper(modifyNotification));
router.get("/:id", checkAuth, errorWrapper(retrieveNotificationById));
router.put("/:id", checkAuth, errorWrapper(modifyNotificationById))

module.exports = router;
