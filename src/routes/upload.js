const router = require("express").Router();
const { errorWrapper } = require("../../utils/errorWrapper");
const checkAuth = require("../middleWare/checkAuth");

const {
    uploadFile,
    getAllFile,
    retriveFileById
} = require("../controllers/upload");

const { upload } = require("../../utils/upload")

router.post("/", checkAuth, upload, errorWrapper(uploadFile));
router.get("/", checkAuth, errorWrapper(getAllFile));
router.get("/:id", checkAuth, errorWrapper(retriveFileById));

module.exports = router;
