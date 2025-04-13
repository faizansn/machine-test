const response = require("../../utils/response");
const { getNofiticationById, updateNotification, updateNotificationById, fetchAllNotification, fetchNofiticationById } = require("../services/notification");

exports.retrieveAllNotification=async(req,res)=>{
    const result=await fetchAllNotification(req.user.id)
    return response.ok(res,result);
}

exports.retrieveNotificationById=async(req,res)=>{
    const result=await fetchNofiticationById(req.params.id);
    return response.ok(res,result);
}

exports.modifyNotification=async(req,res)=>{
    const result=await updateNotification(req.user.id);
    return response.created(res,result);
}

exports.modifyNotificationById=async(req,res)=>{
    const result=await updateNotificationById(req.params.id);
    return response.created(res,result);
}