const express = require("express");
const router = express.Router();
const { errorWrapper } = require("../../utils/errorWrapper");
const checkAuth = require("../middleWare/checkAuth");
const { checkPermission } = require("../middleWare/checkPermission");

const {
  modifyCategoryById,
  removeCategory,
  insertCategory,
  retrieveAllCategories,
  retrieveCategoryById,
} = require("../controllers/category");
const { createCategoryValidator, updateCategoryValidator } = require("../../validators/category");

router.post("/", checkAuth, checkPermission, createCategoryValidator, errorWrapper(insertCategory));
router.get("/", checkAuth, checkPermission, errorWrapper(retrieveAllCategories));
router.get("/:id", checkAuth, checkPermission, errorWrapper(retrieveCategoryById));
router.put("/:id", checkAuth, checkPermission, updateCategoryValidator, errorWrapper(modifyCategoryById));
router.delete("/:id", checkAuth, checkPermission, errorWrapper(removeCategory));

module.exports = router;
