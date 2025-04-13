const db = require("../models");
const {
  ValidationError,
  NoDataFoundError,
  BadRequestError,
} = require("../../utils/customError");
const handleSuccess = require("../../utils/successHandler");

exports.uploadFile = async (req, res) => {
  const { originalname, filename, path, mimetype } = req.files.file[0];
  const data = await db.upload.create({
    originalname,
    filename,
    path,
    mimetype,
  });
  if(data) {
    return handleSuccess("file uploaded successfully", data);
  }
  throw new BadRequestError(`Data not added`);
};

exports.getAllFile = async (req, res) => {
  const data = await db.upload.find();
  if (data && data.length) {
    return handleSuccess("File found", data);
  } else {
    throw new NoDataFoundError(`File not found`);
  }
};

exports.retriveFileById = async (_id) => {
    const data = await db.upload.findOne({ _id });
    if (data) {
      return handleSuccess("File found", data);
    } else {
      throw new NoDataFoundError(`No file found with Id ${_id}`);
    }
  };