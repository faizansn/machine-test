const express = require("express");
const router = express.Router();
const checkAuth = require("../middleWare/checkAuth");
const { checkPermission } = require("../middleWare/checkPermission");
const { errorWrapper } = require("../../utils/errorWrapper");
const { insertTeam, retreiveTeams, retrieveTeamById, modifyTeam, removeTeam } = require("../controllers/team");
const { createTeamValidator, updateTeamValidator } = require("../../validators/team");

router.post('/', checkAuth, checkPermission, createTeamValidator, errorWrapper(insertTeam));
router.get('/', checkAuth, checkPermission, errorWrapper(retreiveTeams));
router.get('/:id', checkAuth, checkPermission, errorWrapper(retrieveTeamById));
router.put('/:id', checkAuth, checkPermission, updateTeamValidator, errorWrapper(modifyTeam));
router.delete('/:id', checkAuth, checkPermission, errorWrapper(removeTeam));

module.exports = router;