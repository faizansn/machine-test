const express = require("express");
const router = express.Router();
const { errorWrapper } = require("../../utils/errorWrapper");
const { upload } = require("../../utils/upload");

const {
  modifyCategoryById,
  removeCategory,
  insertCategory,
  retrieveAllCategories,
  retrieveCategoryById,
} = require("../controllers/category");

router.post("/", /**/ errorWrapper(insertCategory));
router.get("/", /**/ errorWrapper(retrieveAllCategories));
router.get("/:id", /**/ errorWrapper(retrieveCategoryById));
router.put("/:id", /**/ errorWrapper(modifyCategoryById));
router.delete("/:id", /**/ errorWrapper(removeCategory));

module.exports = router;
