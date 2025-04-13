const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const { ObjectId } = require('mongoose').Types;
const {
  DataNotFoundError,
  BadRequestError,
  NoDataFoundError,
} = require("../../utils/customError");
const reuseables = require("../../utils/reuseables");
const { insertIntoNotification } = require("./notification");

exports.createTask = async (body) => {

  const {
    title,
    project,
    dueDate,
    category,
    status,
    description,
    estimatedTimeToComplete,
    assignedTo,
    dependencies,
    recurrence,
    media,
    priorityLevel,
    createdBy
  } = body;

  const task = await db.task.create({
    title,
    description,
    status,
    category,
    project,
    assignedTo,
    dependencies,
    recurrence,
    media,
    estimatedTimeToComplete,
    priorityLevel,
    dueDate,
    createdBy
  });

  if (!task) {
    throw new BadRequestError("Failed to create task");
  }

  const createdByDetails = await db.user.findById(body.createdBy)
    .select("firstName lastName");

  const createdBysName = createdByDetails.firstName ? createdBy.firstName : "" + createdBy.lastName ? createdBy.lastName : "";

  await insertIntoNotification("New Task Assigned", `New task has been assigned to you by ${createdBysName}`, assignedTo, body.createdBy, "assigned task", task._id)
    
  return handleSuccess("Task created Successfully");
};

exports.fetchAllTasks = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const assignedTo = query.assignedTo;
  const project = query.project;
  const category = query.category;
  const sortField = query.sortField || "updatedAt";
  const sortOrder = parseInt(query.sortOrder) || -1
  const status = query.status;
  const search = query.search || "";

  const sortObject = {};
  sortObject[sortField] = sortOrder;

  const conditions = {};
  if (assignedTo) {
    conditions["assignedTo"] = new ObjectId(assignedTo);
  }

  if (project) {
    conditions["project"] = new ObjectId(project);
  }

  if (category) {
    conditions["category"] = new ObjectId(category);
  }

  if (status) {
    conditions["status"] = status;
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
          from: "category",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "project",
          localField: "project",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
   
  ];

  const _project = {
    _id: 1,
    title: 1,
    description: 1,
    status: 1,
    priorityLevel: 1,
    estimatedTimeToComplete: 1,
    media: 1,
    submissionMedia: 1, 
    submissionDescription: 1,
    completedAt: 1,
    "assignedTo.firstName": 1,
    "assignedTo.lastName": 1,
    "category.name": 1,
    "project.title": 1,
  }

  const tasks = await reuseables.find(db.task, searchQuery, skip, limit, sortObject, _project, _lookups)

  const totalResponses = tasks[0]?.totalResponses || 0;
  const result = tasks[0]?.result || [];

  if (result.length == 0) {
    throw new NoDataFoundError("No Tasks found");
  }
  const data = {
    pageNumber,
    limit,
    totalResponses,
    totalPages: Math.ceil(totalResponses / limit),
    tasks: result,
  };
  return handleSuccess("Tasks fetched successfully", data);
};

exports.fetchTaskById = async (_id) => {
    const result = await db.task.findById(_id)
    .populate({
        path: 'assignedTo',
        select: 'firstName lastName',
    })
    .populate({
        path: 'category',
        select: 'name',
    })
    .populate({
        path: 'project',
        select: 'title',
    })
    .lean();

    if (!result) {
        throw new NoDataFoundError("Task not found");
    }

    return handleSuccess("Task fetched successfully");
}


exports.updateTaskById = async (_id, body) => {
    const updateObject = {};
    const { 
        title,
        description,
        status,
        media,
        category,
        priorityLevel,
        dependencies,
        project,
        assignedTo,
        dueDate,
        estimatedTimeToComplete
    } = body;

    if (title) updateObject.title = title;
    if (description) updateObject.description = description;
    if (status) updateObject.status = status;
    if (estimatedTimeToComplete) updateObject.estimatedTime = estimatedTimeToComplete;
    if (dueDate) updateObject.dueDate = dueDate;
    if (dependencies) updateObject.dependencies = dependencies;
    if (assignedTo) updateObject.assignedTo = assignedTo;
    if (category) updateObject.category = category;
    if (priorityLevel) updateObject.priority = priorityLevel;
    if (project) updateObject.project = project;
    if (media) updateObject.media = media;
    
    const result = await reuseables.findByIdAndUpdate(db.task, _id, body)

    if (!result) {
        throw new BadRequestError("Failed to update task");
    }

    return handleSuccess("Task updated successfully");
}


exports.deleteTaskById = async (_id) => {
    const result = await db.task.findByIdAndDelete(_id);

    if (!result) {
        throw new BadRequestError("Failed to delete task");
    }

    return handleSuccess("Task deleted successfully");
}

exports.addCommentToTask = async (_id, comment) => {
    const task = await reuseables.findByIdAndUpdate(_id, {
        $push: {
            comments: {
                by,
                comment: body.comment,
                createdAt: new Date()
            }
        }
    });
}

exports.makeTaskInProgress = async (_id, userId) => {

  const task = await db.task.findById(_id);
  
  const isdependenciesFulfilled = await checkForDependencies(task.dependencies);

    if (!isdependenciesFulfilled) {
        throw new BadRequestError("Dependent tasks is in-complete, Please ensure that they are completed first");
    }

  if (String(task.assignedTo) !== userId) {
    throw new BadRequestError("You are not authorized to start this task");
  }

  task.status = "in progress";
  await task.save();
  return handleSuccess("Task started successfully");
}

exports.completeTask = async (_id, body, userId) => {
  
    const task = await db.task.findById(_id);
  
    if (!task) {
      throw new NoDataFoundError("Task not found");
    }
    console.log(task);
    const isdependenciesFulfilled = await checkForDependencies(task.dependencies);

    if (!isdependenciesFulfilled) {
        throw new BadRequestError("Dependent task completed, Please ensure that they are completed first");
    }
    console.log(task.assignedTo, userId)
    if (String(task.assignedTo) !== userId) {
      throw new BadRequestError("You are not authorized to complete this task");
    }

    const { submissionMedia, submissionDescription } = body;

    if (submissionMedia) task.submissionMedia = submissionMedia;
    if (submissionDescription) task.submissionDescription = submissionDescription;
    task.status = "done";
    task.completedAt = new Date();
    await task.save();

    return handleSuccess("Task completed successfully");
}

async function checkForDependencies(dependencies) {
  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    return true;
  }

    for ( let id of dependencies) {
        const dependentTask = await db.task.findById(id);
        if (dependentTask) {
            if (dependentTask.completedAt !== null) {
                return false
            }
        }
    };

    return true;
}

exports.fetchTasksReport = async () => {
  const tasks = await db.task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1  },
        tasks: { $push: "$$ROOT" },
      }
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
        tasks: 1
      }
    }
  ]);  

  return handleSuccess("Tasks status fetched successfully", tasks);
}


