const mongoose = require("mongoose");
const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "permission",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const role = mongoose.model("role", roleSchema);

module.exports = role;
