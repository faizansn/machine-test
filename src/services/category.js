const {
  NoDataFoundError,
  BadRequestError,
} = require("../../utils/customError");
const ExcelJS = require("exceljs");
const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");

exports.createCategory = async (body) => {
  const categories = await db.category.create(body);
  if (!categories) {
    throw new BadRequestError("Error creating category");
  }
  return handleSuccess("Category created successfully", categories);
};

exports.getAllCategories = async () => {
  const category = await db.category.find();
  if (!category) {
    throw new NoDataFoundError("No categories found");
  }
  return handleSuccess("All categories fetched successfully", category);
};

exports.getCatergoryById = async (_id) => {
  const category = await db.category.findById(_id);
  if (!category) {
    throw new NoDataFoundError("Category not found");
  }
  return handleSuccess("Category fetched successfully", category);
};

exports.updateCategoryById = async (_id, body) => {
  const category = await db.category.findByIdAndUpdate(_id, body, {
    new: true,
  });

  if (!category) {
    throw new NoDataFoundError("Category not found");
  }
  return handleSuccess("Category updated successfully", category);
};

exports.deleteCategoryById = async (_id) => {
  const category = await db.category.findByIdAndDelete(_id);
  if (!category) {
    throw new BadRequestError("Error deleting category");
  }
  return handleSuccess("Category deleted successfully");
};