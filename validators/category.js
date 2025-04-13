const { body, param } = require('express-validator');
const db = require('../src/models/index');

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string')
];

const updateCategoryValidator = [
  param('id')
    .isMongoId().withMessage('Invalid Category ID')
    .custom(async (value) => {
      const categoryExists = await db.category.findById(value);
      if (!categoryExists) {
        throw new Error('Category does not exist');
      }
      return true;
    }),

  body('name')
    .optional()
    .trim()
    .isString().withMessage('Name must be a string'),

  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string')
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator
};
