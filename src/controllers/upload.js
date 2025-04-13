const response = require("../../utils/response");
const { uploadFile,getAllFile,retriveFileById } = require('../services/upload')

exports.uploadFile = async (req,res) => {
    const result = await uploadFile(req,res)
    return response.created(res, result);
}

exports.getAllFile = async (req,res) => {
    const result = await getAllFile(req,res)
    return response.ok(res, result);
}

exports.retriveFileById = async (req,res) => {
    const { id } = req.params;
    const result = await retriveFileById(id)
    return response.ok(res, result);
}