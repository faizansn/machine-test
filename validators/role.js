const { body, param  } = require('express-validator');
const db = require('../src/models/index');

const createRoleValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string'),

  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array of ObjectIds')
    .custom(async (permissions) => {
      for (let id of permissions) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid permission ID: ${id}`);
        }
        const exists = await db.permission.findById(id);
        if (!exists) {
          throw new Error(`Permission not found for ID: ${id}`);
        }
      }
      return true;
    })
];

const updateRoleValidator = [
  param('id')
    .isMongoId().withMessage('Invalid Role ID')
    .custom(async (id) => {
      const exists = await db.role.findById(id);
      if (!exists) throw new Error('Role does not exist');
      return true;
    }),

  body('name')
    .optional()
    .trim()
    .isString().withMessage('Name must be a string'),

  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string'),

  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array of ObjectIds')
    .custom(async (permissions) => {
      for (let id of permissions) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid permission ID: ${id}`);
        }
        const exists = await db.permission.findById(id);
        if (!exists) {
          throw new Error(`Permission not found for ID: ${id}`);
        }
      }
      return true;
    })
];

module.exports = {
  createRoleValidator,
  updateRoleValidator
};
