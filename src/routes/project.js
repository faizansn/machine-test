const express = require("express");
const router = express.Router();
const checkAuth = require("../middleWare/checkAuth");
const { errorWrapper } = require("../../utils/errorWrapper");
const { insertProject, retreiveProjects, retrieveProjectById, modifyProject, removeProject, retrieveAllProjectsProgress } = require("../controllers/project");

router.post('/', checkAuth, errorWrapper(insertProject));
router.get('/', checkAuth, errorWrapper(retreiveProjects));
router.get('/progress', checkAuth, errorWrapper(retrieveAllProjectsProgress));
router.get('/:id', checkAuth, errorWrapper(retrieveProjectById));
router.put('/:id', checkAuth, errorWrapper(modifyProject));
router.delete('/:id', checkAuth, errorWrapper(removeProject));

module.exports = router;