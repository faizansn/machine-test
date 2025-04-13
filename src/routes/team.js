const express = require("express");
const router = express.Router();
const checkAuth = require("../middleWare/checkAuth");
const { errorWrapper } = require("../../utils/errorWrapper");
const { insertTeam, retreiveTeams, retrieveTeamById, modifyTeam, removeTeam } = require("../controllers/team");

router.post('/', checkAuth, errorWrapper(insertTeam));
router.get('/', checkAuth, errorWrapper(retreiveTeams));
router.get('/:id', checkAuth, errorWrapper(retrieveTeamById));
router.put('/:id', checkAuth, errorWrapper(modifyTeam));
router.delete('/:id', checkAuth, errorWrapper(removeTeam));

module.exports = router;