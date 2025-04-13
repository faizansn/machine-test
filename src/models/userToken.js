const mongoose = require("mongoose");
const { Schema } = mongoose;

const userTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = userToken;
