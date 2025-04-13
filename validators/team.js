const { body, param  } = require('express-validator');
const db = require('../src/models/index');

const createTeamValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string'),

  body('members')
    .optional()
    .isArray().withMessage('Members must be an array of MongoDB ObjectIds')
    .custom(async (members) => {
      if (Array.isArray(members)) {
        for (let memberId of members) {
          const userExists = await db.user.findById( memberId);
          if (!userExists) {
            throw new Error(`User with id ${memberId} does not exist`);
          }
        }
      }
      return true;
    }),

  body('admin')
    .isMongoId().withMessage('Admin must be a valid MongoDB ObjectId')
    .custom(async (value) => {
      const userExists = await db.user.findById(value);
      if (!userExists) {
        throw new Error('Admin user does not exist');
      }
      return true;
    }),

  body('createdBy')
    .isMongoId().withMessage('CreatedBy must be a valid MongoDB ObjectId')
    .custom(async (value) => {
      const userExists = await db.user.findById(value);
      if (!userExists) {
        throw new Error('Creator does not exist');
      }
      return true;
    })
];

const updateTeamValidator = [
  param('id')
    .isMongoId().withMessage('Invalid Team ID')
    .custom(async (value) => {
      const teamExists = await db.team.findById(value);
      if (!teamExists) {
        throw new Error('Team does not exist');
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
    .isString().withMessage('Description must be a string'),

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

  body('admin')
    .optional()
    .isMongoId().withMessage('Admin must be a valid MongoDB ObjectId')
    .custom(async (value) => {
      if (value) {
        const userExists = await db.user.findById(value);
        if (!userExists) {
          throw new Error('Admin user does not exist');
        }
      }
      return true;
    }),

  body('createdBy')
    .optional()
    .isMongoId().withMessage('CreatedBy must be a valid MongoDB ObjectId')
    .custom(async (value) => {
      if (value) {
        const userExists = await db.user.findById(value);
        if (!userExists) {
          throw new Error('Creator does not exist');
        }
      }
      return true;
    })
];

module.exports = {
  createTeamValidator,
  updateTeamValidator
};
