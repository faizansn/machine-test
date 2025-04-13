const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const basename = path.basename(__filename);
const db = {};

// Get the directory containing the models
const modelsDir = __dirname;

fs.readdirSync(modelsDir)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.includes(".test.js")
  )
  .forEach((file) => {
    const model = require(path.join(modelsDir, file));
    db[model.modelName || path.basename(file, ".js")] = model; // Adjust for exporting directly
  });

module.exports = db;
