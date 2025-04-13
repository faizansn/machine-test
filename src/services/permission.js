const db = require("../models");
const {
  ValidationError,
  NoDataFoundError,
  BadRequestError,
} = require("../../utils/customError");
const handleSuccess = require("../../utils/successHandler");

exports.createPermission = async (body) => {
  const { entity, actionName, description, baseUrl, path, method } = body;
  const permissionCreated = await db.permission.create({
    entity,
    actionName,
    description,
    baseUrl,
    path,
    method,
  });
  if (permissionCreated) {
    return handleSuccess("Permission created", permissionCreated);
  }
  throw new BadRequestError(`Data not added`);
};

exports.fetchPermissionDetails = async () => {
  const permissionFound = await db.permission.find().lean().populate("entity");
  if (permissionFound && permissionFound.length) {
    return handleSuccess("Permission found", permissionFound);
  }
  throw new NoDataFoundError(`No Permission found`);
};

exports.fetchPermissionById = async (_id) => {
  const permissionFound = await db.permission
    .findOne({ _id })
    .populate("entity");
  if (permissionFound) {
    return handleSuccess("Permission found", permissionFound);
  } else {
    throw new NoDataFoundError(`No Permission found with Id ${_id}`);
  }
};

exports.updatePermissionById = async (_id, body) => {
  const { entity, actionName, description, baseUrl, path, method } = body;
  const updatedData = await db.permission.findOneAndUpdate(
    { _id },
    { entity, actionName, description, baseUrl, path, method },
    { new: true }
  );

  if (!updatedData) {
    throw new NoDataFoundError(`No Permission found with Id ${_id}`);
  }
  return handleSuccess("Permission updated", updatedData);
};

exports.deletePermissionById = async (_id) => {
  const removedPermission = await db.permission.findOneAndUpdate(
    { _id },
    { deletedAt: new Date() }
  );
  if (removedPermission) {
    return handleSuccess("Permission deleted", removedPermission);
  }
  throw new NoDataFoundError(`No Permission found with Id ${_id}`);
};
