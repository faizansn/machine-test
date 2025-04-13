const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const notificationSchema = new Schema(
  {
    title:{
        type:String,
        required:true
    },
    message:{
        type:String
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    moduleType:{
      type: String,
      enum: ["overdue task","assigned task"]
    },
    isActive: {
        type:Boolean,
        default:true
    }
  },
  {
    timestamps: true,
  }
);

const notification = mongoose.model("notification", notificationSchema);
module.exports = notification;
