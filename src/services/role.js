const db = require("../models");
const {
  ValidationError,
  NoDataFoundError,
  BadRequestError,
} = require("../../utils/customError");
const handleSuccess = require("../../utils/successHandler");

exports.createRole = async (roleData) => {
  const { name, description } = roleData;
  const role = await db.role.create({
    name,
    description,
  });
  if (role) {
    return handleSuccess("Role created", role);
  } else {
    throw new BadRequestError(`Data not added`);
  }
};

exports.fetchRoleDetails = async () => {
  const role = await db.role.find().populate("permissions").lean();

  if (role.length === 0) {
    throw new NoDataFoundError(`No Role found`);
  }

  return handleSuccess("Role found", role);
};

exports.fetchRoleById = async (_id) => {
  const role = await db.role
    .findOne({ _id })
    .lean()
    .populate("permissions");
  if (role) {
    return handleSuccess("Role found", role);
  }
  throw new NoDataFoundError(`No Role found with Id ${_id}`);
};

exports.updateRoleById = async (_id, body) => {
  const { name, description, permissions } = body;

  const updateRole = await db.role.findByIdUpdate(
    _id,
    { name, description, permissions },
    { new: true }
  );
  if (updateRole) {
    return handleSuccess("Role updated", updateRole);
  }
  throw new BadRequestError(`No Role updated with Id ${_id}`);
};

exports.deleteRoleById = async (_id) => {
  const role = await db.role.findByIdAndDelete(_id);

  if (!role) {
    throw new NoDataFoundError(`No Role found.`);
  }

  return handleSuccess("Role deleted");
};
