const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
    },
    media: {
      type: String,
    },
    priorityLevel: {
        type: String,
        enum: ["High", "Medium", "Low"]
    },
    estimatedTimeToComplete: {
        type: Number
    },
    comments: [{
        by: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        comment: {
            type: String
        },
        createdAt: {
            type: Date,
            required: true
        }
    }],
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    recurrence: {
        type: String,
        enum: ["once", "daily", "weekly", "monthly"],
        default: "once"
    },
    isRecurred: {
        type: Boolean,
        default: false
    },
    taskRecurredFrom: {
        type: Schema.Types.ObjectId,
        ref: "task"
    },
    status: {
      type: String,
      enum: ["not started", "in progress", "done"],
      default: "not started",
    },
    submissionMedia: {
        type: String,
    },
    submissionDescription: {
        type: String
    },
    dependencies: [{
        type: Schema.Types.ObjectId,
        ref: "task"
    }],
    completedAt: {
        type: Date,
        default: null
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
  },
  {
    timestamps: true,
  }
);

const task = mongoose.model("task", taskSchema);
module.exports = task;
