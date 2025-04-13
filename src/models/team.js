const mongoose = require("mongoose");
const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    admin: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const team = mongoose.model("team", teamSchema);
module.exports = team;