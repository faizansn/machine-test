const db = require("../models");
const {
  ValidationError,
  NoDataFoundError,
  BadRequestError,
} = require("../../utils/customError");
const handleSuccess = require("../../utils/successHandler");
const reuseables = require("../../utils/reuseables");

exports.createUser = async (body) => {
  const { firstName, lastName, password, avatar, email, role } = body;

  const user = await db.user.create({
    firstName,
    lastName,
    password,
    avatar,
    email,
    role,
  });

  if (!user) {
    throw new BadRequestError(`Failed to create user`);
  }

  return handleSuccess("User created successfully");
};

exports.fetchUserDetails = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const search = query.search || "";
  const sortField = query.sortField || "updatedAt";
  const sortOrder = parseInt(query.sortOrder) || -1;
  const sortObject = {};
  sortObject[sortField] = sortOrder;

  const searchQuery = {
    $and: [
      {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { "role.name": { $regex: search, $options: "i" } },
        ],
      },
    ],
  };

  const _lookups = [
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
    {
      $unwind: {
        path: "$role",
        preserveNullAndEmptyArrays: true,
      }
    }
  ];

  const _project = {
    firstName: 1,
    lastName: 1,
    email: 1,
    avatar: 1,
    "role.name": 1,
  };

  const users = await reuseables.find(
    db.user,
    searchQuery,
    skip,
    limit,
    sortObject,
    _project,
    _lookups
  );

  const totalResponses = users[0]?.totalResponses || 0;
  const result = users[0]?.result || [];

  if (result.length === 0) {
    throw new NoDataFoundError(`No users found`);
  }

  const data = {
    pageNumber,
    limit,
    totalResponses,
    totalPages: Math.ceil(totalResponses / limit),
    responses: result,
  };

  return handleSuccess("Users fetched successfully", data);
};

exports.fetchUserById = async (_id) => {
  const user = await db.user.findById(_id).populate({
    path: "role",
    select: "name",
  });

  if (!user) {
    throw new NoDataFoundError(`User not found.`);
  }
  
  return handleSuccess("User found", user);
};

exports.updateUserById = async (_id, body) => {
  const { firstName, lastName, avatar, email, role } = body;

  const obj = {};

  if (firstName) obj.firstName = firstName;
  if (lastName) obj.lastName = lastName;
  if (avatar) obj.avatar = avatar;
  if (email) obj.email = email;
  if (role) obj.role = role;

  const user = await reuseables.findByIdAndUpdate(db.user, _id, obj);

  if (!user) {
    throw new BadRequestError(`User not found`);
  }

  return handleSuccess("User updated", user);
};

exports.deleteUserById = async (_id) => {
  const deleteUser = await db.user.findByIdAndDelete(_id);

  if (!deleteUser) {
    throw new NoDataFoundError(`Failed to delete user`);
  }

  return handleSuccess("User deleted successfully");
};
