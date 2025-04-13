const mongoose = require("mongoose");
const { Schema } = mongoose;

const uploadSchema = new Schema(
  {
    originalname: {
      type: String,
    },
    filename: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    path: {
      type: String,
    },
    caption: {
        type: String,
    },
  },
  {
    timestamps: true,
  }
);

const upload = mongoose.model("upload", uploadSchema);

module.exports = upload;
