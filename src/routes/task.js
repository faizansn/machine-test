const express = require("express");
const router = express.Router();
const checkAuth = require("../middleWare/checkAuth");
const { checkPermission } = require('../middleWare/checkPermission');
const { errorWrapper } = require("../../utils/errorWrapper.js");
const { insertTask, retrieveTasks, retrieveTaskById, modifyTask, removeTask, submitTask, startTask, retrieveTasksReport } = require("../controllers/task");
const { createTaskValidator, updateTaskValidator } = require("../../validators/task.js");

router.post('/', checkAuth, checkPermission, createTaskValidator, errorWrapper(insertTask));
router.get('/', checkAuth, checkPermission, errorWrapper(retrieveTasks));
router.get('/report', checkAuth, checkPermission, errorWrapper(retrieveTasksReport));
router.get('/:id', checkAuth, checkPermission, errorWrapper(retrieveTaskById));
router.post('/:id/complete', checkAuth, checkPermission, errorWrapper(submitTask));
router.put('/:id/start', checkAuth, checkPermission, errorWrapper(startTask));
router.put('/:id', checkAuth, checkPermission, updateTaskValidator, errorWrapper(modifyTask));
router.delete('/:id', checkAuth, checkPermission, errorWrapper(removeTask));


module.exports = router;