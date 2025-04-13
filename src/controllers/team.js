const response = require("../../utils/response");
const { createTeam, fetchAllTeams, fetchTeamById, updateTeamById, deleteTeamById } = require("../services/team");

exports.insertTeam = async (req, res) => {
  const result = await createTeam(req.user.id, req.body);
  return response.created(res, result);
};

exports.retreiveTeams = async (req, res) => {
  const result = await fetchAllTeams(req.query);
  return response.ok(res, result);
};

exports.retrieveTeamById = async (req, res) => {
  const result = await fetchTeamById(req.params.id);
  return response.ok(res, result);
};

exports.modifyTeam = async (req, res) => {
  const result = await updateTeamById(req.params.id, req.body);
  return response.ok(res, result);
};

exports.removeTeam = async (req, res) => {
  const result = await deleteTeamById(req.params.id);
  return response.ok(res, result);
};
