const { NoDataFoundError, BadRequestError } = require("../../utils/customError");
const handleSuccess = require("../../utils/successHandler");
const db = require("../models");
const { getIO } = require("../../config/socket");

exports.fetchAllNotification=async(userId)=>{
    const fetchAllNotification = await db.notification
        .find({ assignedTo: userId })
        .populate("assignedTo","firstName lastName email");

    if (!fetchAllNotification.length) {
        throw new NoDataFoundError("No New Notifications");
    }
    
    return handleSuccess("All Notifications Fetched Successfully", fetchAllNotification);   
}

exports.fetchNofiticationById = async(_id)=>{
    const fetchNotification = await db.notification.findById(_id).populate("assignedTo","firstName lastName email");;

    if(!fetchNotification){
        throw new NoDataFoundError("Notification cannot be found");
    };

    return handleSuccess("Notification Fetched Successfully",fetchNotification)
}

exports.updateNotification=async(userId)=>{
    const updateNotification = await db.notification.updateMany(
        { assignedTo: userId },
        { $set: { isActive: false } } 
    );
    
    if (!updateNotification.modifiedCount) {
        throw new BadRequestError("Notifications cannot be marked as unread");
    }
    
    return handleSuccess("Notification marked as read successfully");
    
}

exports.updateNotificationById = async (_id)=>{

    const modifiedNotification = await db.notification.findByIdAndUpdate(
        _id, 
        { $set: { isActive: false } }, 
        { new: true }
    );
    
    if (!modifiedNotification) {
        throw new BadRequestError("Notification cannot be marked as unread");
    }

    if (modifiedNotification.moduleType === "announcement") {    
        await db.announcement.updateOne(
            { 
                _id: modifiedNotification["module"], 
                "recipientsStatus.user": modifiedNotification.assignedTo 
            },
            { 
                $set: { "recipientsStatus.$.status": "opened", "recipientsStatus.$.openedAt": new Date() }
            }
        );
    }
    
    return handleSuccess("Notification marked as read successfully", modifiedNotification);
    
}

exports.insertIntoNotification = async (title,message,assignedTo,createdBy,moduleType,module) => {
    const io = getIO();

    const obj = { title, message, assignedTo, createdBy, moduleType, module };
    const notification = await db.notification.create(obj);
    
    if (assignedTo && io) {
        io.to(assignedTo.toString()).emit("new_notification", notification);
    }

}   