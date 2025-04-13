const response = require("../../utils/response");
const {
  getAllCategories,
  getCatergoryById,
  updateCategoryById,
  deleteCategoryById,
  createCategory,
} = require("../services/category");

exports.insertCategory = async (req, res) => {
  const result = await createCategory(req.body);
  return response.created(res, result);
};

exports.retrieveAllCategories = async (req, res) => {
  const result = await getAllCategories();
  return response.ok(res, result);
};

exports.retrieveCategoryById = async (req, res) => {
  const result = await getCatergoryById(req.params.id);
  return response.ok(res, result);
};

exports.modifyCategoryById = async (req, res) => {
  const result = await updateCategoryById(req.params.id, req.body);
  return response.ok(res, result);
};

exports.removeCategory = async (req, res) => {
  const result = await deleteCategoryById(req.params.id);
  return response.ok(res, result);
};