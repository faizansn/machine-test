const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set the storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    let dest = "public/uploads/";
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    cb(null, dest);
  },
  filename(req, file, cb) {
    let fileName = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

// Initialize the upload

function checkFileType(file, cb) {
  const allowedFileTypes = [
    ".zip",
    ".xlsx",
    ".xls",
    ".docx",
    ".xlsm",
    ".png",
    ".csv",
  ];

  const fileExtension = `.${file.originalname.split(".").pop()}`;
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
}

exports.upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([{ name: "file", maxCount: 1 }]);
