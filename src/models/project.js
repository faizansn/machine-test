  const mongoose = require("mongoose");
  const { Schema } = mongoose;

  const projectSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }],
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
    { timestamps: true }
  );

  const project = mongoose.model("project", projectSchema);
  module.exports = project;
