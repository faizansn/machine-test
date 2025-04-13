const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const { ObjectId } = require('mongoose').Types;
const {
  DataNotFoundError,
  BadRequestError,
  NoDataFoundError,
} = require("../../utils/customError");
const reuseables = require("../../utils/reuseables");

exports.createTeam = async (userId, body) => {
  const { name, description, members } = body;

  const team = await db.team.create({
    name,
    description,
    members,
    admin: userId,
    createdBy: userId
  });

  if (!team) {
    throw new BadRequestError("Failed to create team");
  }

  return handleSuccess("Team created Successfully");
};

exports.fetchAllTeams = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const admin = query.admin;
  const search = query.search || "";
  const sortField = query.sortField || "updatedAt";
  const sortOrder = parseInt(query.sortOrder) || -1;

  const sortObject = {};
  sortObject[sortField] = sortOrder;

  const searchQuery = {
    $and: [
      {
        $or: [
          { "admin.firstName": { $regex: search, $options: "i" } },
          { "admin.lastName": { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
    ],
  };

  const _lookups = [
    {
        $lookup: {
          from: "users",
          localField: "admin",
          foreignField: "_id",
          as: "admin",
        },
    },   
    {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
    },
  ];

  const _project = {
    _id: 1,
    name: 1,
    description: 1,
    "admin._id": 1,
    "admin.firstName": 1,
    "admin.lastName": 1,
    "members.firstName": 1,
    "members.lastName": 1,
  }

  const teams = await reuseables.find(db.team, searchQuery, skip, limit, sortObject, _project, _lookups)

  const totalResponses = teams[0]?.totalResponses || 0;
  const result = teams[0]?.result || [];

  if (result.length == 0) {
    throw new NoDataFoundError("No Teams found");
  }

  const data = {
    pageNumber,
    limit,
    totalResponses,
    totalPages: Math.ceil(totalResponses / limit),
    teams: result,
  };
  return handleSuccess("Teams fetched successfully", data);
};

exports.fetchTeamById = async (_id) => {
    const result = await db.team.findById(_id)
    .populate({
        path: 'assignedTo',
        select: 'firstName lastName',
    })
    .populate({
        path: 'members',
        select: 'firstName lastName',
    })
    .lean();

    if (!result) {
        throw new DataNotFoundError("Team not found");
    }

    return handleSuccess("Team fetched successfully");
}


exports.updateTeamById = async (_id, body) => {
    const updateObject = {};
    const { name, description, assignedTo, members } = body;
    
    if (name) updateObject.name = name;
    if (description) updateObject.description = description;
    if (assignedTo) updateObject.assignedTo = assignedTo;
    if (members) updateObject.members = members;
    
    const result = await reuseables.findByIdAndUpdate(db.team, _id, body)

    if (!result) {
        throw new BadRequestError("Failed to update team");
    }

    return handleSuccess("Team updated successfully");
}


exports.deleteTeamById = async (_id) => {
    const result = await db.team.findByIdAndDelete(_id);

    if (!result) {
        throw new BadRequestError("Failed to delete team");
    }

    return handleSuccess("Team deleted successfully");
}