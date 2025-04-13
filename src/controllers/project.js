const response = require("../../utils/response");
const { createProject, fetchAllProjects, fetchProjectById, updateProjectById, deleteProjectById, fetchAllProjectsProgress } = require("../services/project");

exports.insertProject = async (req, res) => {
  const result = await createProject(req.user.id, req.body);
  return response.created(res, result);
};

exports.retreiveProjects = async (req, res) => {
  const result = await fetchAllProjects(req.query);
  return response.ok(res, result);
};

exports.retrieveProjectById = async (req, res) => {
  const result = await fetchProjectById(req.params.id);
  return response.ok(res, result);
};

exports.modifyProject = async (req, res) => {
  const result = await updateProjectById(req.params.id, req.body);
  return response.ok(res, result);
};

exports.removeProject = async (req, res) => {
  const result = await deleteProjectById(req.params.id);
  return response.ok(res, result);
};

exports.retrieveAllProjectsProgress = async (req, res) => {
  const result = await fetchAllProjectsProgress(req.query);
  return response.ok(res, result);  
}

exports.insertTeamMembersToProject = async (req, res) => {
  const result = await addTeamMembersToProject(req.params.id, req.body);
  return response.ok(res, result);
}
