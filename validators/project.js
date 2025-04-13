const { body, param } = require('express-validator');
const db = require("../src/models/index");

const createProjectValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),
  
  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string'),
  
  body('assignedTo')
    .optional()
    .isMongoId().withMessage('AssignedTo must be a valid MongoDB ObjectId')
    .custom(async (value) => {
      const userExists = await db.user.findById(value);
      if (!userExists) {
        throw new Error('Assigned user does not exist');
      }
      return true;
    }),

  body('members')
    .optional()
    .isArray().withMessage('Members must be an array of MongoDB ObjectIds')
    .custom(async (members) => {
      if (Array.isArray(members)) {
        for (let memberId of members) {
          const userExists = await db.user.findById(memberId);
          if (!userExists) {
            throw new Error(`User with id ${memberId} does not exist`);
          }
        }
      }
      return true;
    }),

  body('createdBy')
    .isMongoId().withMessage('CreatedBy must be a valid MongoDB ObjectId')
    .custom(async (value) => {
      const userExists = await db.project.findById(value);
      if (!userExists) {
        throw new Error('Creator does not exist');
      }
      return true;
    })
];

const updateProjectValidator = [
  param('id')
    .isMongoId().withMessage('Invalid Project ID')
    .custom(async (value) => {
      const projectExists = await db.project.findById(value);
      if (!projectExists) {
        throw new Error('Project does not exist');
      }
      return true;
    }),

  body('title')
    .optional()
    .trim()
    .isString().withMessage('Title must be a string'),

  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string'),

  body('assignedTo')
    .optional()
    .isMongoId().withMessage('AssignedTo must be a valid MongoDB ObjectId')
    .custom(async (value) => {
      const userExists = await db.user.findById(value);
      if (value && !userExists) {
        throw new Error('Assigned user does not exist');
      }
      return true;
    }),

  body('members')
    .optional()
    .isArray().withMessage('Members must be an array of MongoDB ObjectIds')
    .custom(async (members) => {
      if (Array.isArray(members)) {
        for (let memberId of members) {
          const userExists = await db.user.findById(memberId);
          if (!userExists) {
            throw new Error(`User with id ${memberId} does not exist`);
          }
        }
      }
      return true;
    }),

  body('createdBy')
    .optional()
    .isMongoId().withMessage('CreatedBy must be a valid MongoDB ObjectId')
    .custom(async (value) => {
      const userExists = await db.user.findById(value);
      if (value && !userExists) {
        throw new Error('Creator does not exist');
      }
      return true;
    })
];

module.exports = {
  createProjectValidator,
  updateProjectValidator
};
