const response = require("../../utils/response");
const {
  createTask,
  fetchAllTasks,
  fetchTaskById,
  completeTask,
  updateTaskById,
  deleteTaskById,
  makeTaskInProgress,
  fetchTasksReport,
} = require("../services/task");

exports.insertTask = async (req, res) => {
  const result = await createTask({ ...req.body, createdBy: req.user.id });
  return response.created(res, result);
};

exports.retrieveTasks = async (req, res) => {
  const result = await fetchAllTasks(req.query);
  return response.ok(res, result);
};

exports.retrieveTaskById = async (req, res) => {
  const result = await fetchTaskById(req.params.id);
  return response.ok(res, result);
};

exports.modifyTask = async (req, res) => {
  const result = await updateTaskById(req.params.id, req.body);
  return response.ok(res, result);
};

exports.removeTask = async (req, res) => {
  const result = await deleteTaskById(req.params.id);
  return response.ok(res, result);
};

exports.submitTask = async (req, res) => {
  const result = await completeTask(req.params.id, req.body, req.user.id);
  return response.ok(res, result);
};

exports.startTask = async (req, res) => {
  const result = await makeTaskInProgress(req.params.id, req.user.id);
  return response.ok(res, result);
};

exports.retrieveTasksReport = async (req, res) => {
  const result = await fetchTasksReport();
  return response.ok(res, result);
}
