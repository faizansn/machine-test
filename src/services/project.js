const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const { ObjectId } = require('mongoose').Types;
const {
  BadRequestError,
  NoDataFoundError,
} = require("../../utils/customError");
const reuseables = require("../../utils/reuseables");

exports.createProject = async (userId, body) => {
  const { title, description, assignedTo, members } = body;

  const project = await db.project.create({
    title,
    description,
    members,
    assignedTo,
    createdBy: userId,
  });

  if (!project) {
    throw new BadRequestError("Failed to create project");
  }

  return handleSuccess("Project created Successfully");
};

exports.fetchAllProjects = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const assignedTo = query.assignedTo;
  const search = query.search || "";
  const sortField = query.sortField || "udpatedAt";
  const sortOrder = parseInt(query.sortOrder) || -1;

  const sortObject = {};
  sortObject[sortField] = sortOrder;

  const conditions = {};
  if (assignedTo) {
    conditions["assignedTo"] = new ObjectId(assignedTo);
  }

  const searchQuery = {
    $and: [
      conditions,
      {
        $or: [
          { "assignedTo.firstName": { $regex: search, $options: "i" } },
          { "assignedTo.lastName": { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
    ],
  };

  const _lookups = [
    {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
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
    title: 1,
    description: 1,
    "assignedTo.firstName": 1,
    "assignedTo.lastName": 1,
    "members.firstName": 1,
    "members.lastName": 1,
  }

  const projects = await reuseables.find(db.project, searchQuery, skip, limit, sortObject, _project, _lookups)

  const totalResponses = projects[0]?.totalResponses || 0;
  const result = projects[0]?.result || [];

  if (result.length == 0) {
    throw new NoDataFoundError("No Projects found");
  }
  const data = {
    pageNumber,
    limit,
    totalResponses,
    totalPages: Math.ceil(totalResponses / limit),
    projects: result,
  };
  return handleSuccess("Projects fetched successfully", data);
};

exports.fetchProjectById = async (_id) => {
    const result = await db.project.findById(_id)
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
        throw new NoDataFoundError("Project not found");
    }

    return handleSuccess("Project fetched successfully");
}


exports.updateProjectById = async (_id, body) => {
    const updateObject = {};
    const { title, description, assignedTo, members } = body;
    
    if (title) updateObject.title = title;
    if (description) updateObject.description = description;
    if (assignedTo) updateObject.assignedTo = assignedTo;
    if (members) updateObject.members = members;
    
    const result = await reuseables.findByIdAndUpdate(db.project, _id, body)

    if (!result) {
        throw new BadRequestError("Failed to update project");
    }

    return handleSuccess("Project updated successfully");
}


exports.deleteProjectById = async (_id) => {
    const result = await db.project.findByIdAndDelete(_id);

    if (!result) {
        throw new BadRequestError("Failed to delete project");
    }

    return handleSuccess("Project deleted successfully");
}

exports.addTeamMembersToProject = async (_id, body) => {
  const { teamMembers } = body;
  const result = await db.project.findByIdAndUpdate(
    _id,
    {
      $addToSet: { members: { $each: teamMembers.map((member) => member) } },
    },
    { new: true }
  );
  if (!result) {
    throw new BadRequestError("Failed to add team members to project");
  }
  return handleSuccess("Team members added to project successfully");
};

exports.fetchAllProjectsProgress = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const search = query.search || "";
  const sortOrder = parseInt(query.sortOrder) || -1;
  const sortField = query.sortField || "createdAt";
  const assignedTo = query.assignedTo;
  const conditions = {};
  const sortObject = {};
  sortObject[sortField] = sortOrder

  if (assignedTo) {
    conditions.assignedTo = assignedTo;
  }

  const searchQuery = {
    $and: [
      conditions,
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      }
    ]
  };

  const _project = {
    title: 1,
    description: 1,
    "assignedToi9j.firstName": 1,
    "assiopp0lkgnedTo.lastName": 1,
    "members.firstName": 1,
    "members.lastName": 1,
    "createdBy.firstName": 1,
    "createdBy.lastName": 1,
    updatedAt: 1,
    createdAt: 1,
    tasks: 1
  };

  const _lookups = [
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
      },
    },
    {
      $unwind: {
        path: "$assignedTo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
      },
    },
    {
      $unwind: {
        path: "$createdBy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
      },
    },
    {
      $lookup: {
        from: "tasks",
        let: { project: "$_id"},
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$project", "$$project"]
              }
            }
          },
          {
            $group: {
              "_id": "$status",
              count: { $sum: 1 },
              tasks: { $push: "$$ROOT" },
            }
          }
        ],
        as: "tasks"
      }
    },
  ];

  const projects = await reuseables.find(
    db.project,
    searchQuery,
    skip,
    limit,
    sortObject,
    _project,
    _lookups
  );

  const totalResponses = projects[0]?.totalResponses || 0;
  const result = projects[0]?.result || [];

  const data = {
    pageNumber,
    limit,
    totalResponses,
    totalPages: Math.ceil(totalResponses / limit),
    responses: result,
  };

  return handleSuccess("All projects fetched successfully", data);
};
