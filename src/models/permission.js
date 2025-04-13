const mongoose = require("mongoose");
const { Schema } = mongoose;

const permissionSchema = new Schema(
  {
    actionName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    baseUrl: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const permission = mongoose.model("permission", permissionSchema);

module.exports = permission;
