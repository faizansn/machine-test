const express = require("express");
const router = express.Router();
const checkAuth = require("../middleWare/checkAuth");
const { checkPermission } = require("../middleWare/checkPermission");
const { errorWrapper } = require("../../utils/errorWrapper");
const { insertProject, retreiveProjects, retrieveProjectById, modifyProject, removeProject, retrieveAllProjectsProgress } = require("../controllers/project");
const { createProjectValidator, updateProjectValidator } = require("../../validators/project");

router.post('/', checkAuth, checkPermission, createProjectValidator, errorWrapper(insertProject));
router.get('/', checkAuth, checkPermission, errorWrapper(retreiveProjects));
router.get('/progress', checkAuth, checkPermission, errorWrapper(retrieveAllProjectsProgress));
router.get('/:id', checkAuth, checkPermission, errorWrapper(retrieveProjectById));
router.put('/:id', checkAuth, checkPermission, updateProjectValidator, errorWrapper(modifyProject));
router.delete('/:id', checkAuth, checkPermission, errorWrapper(removeProject));

module.exports = router;