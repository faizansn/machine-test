const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { cronDaily } = require("../utils/cron/cronDaily");
dotenv.config();

const connectToDatabase = async () => {
  mongoose
    .connect("mongodb+srv://sahil:Admin%40123@cluster0.izcms3r.mongodb.net/machine-test?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      cronDaily
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.log(
        `Error While Connecting Database\n${err}\nRetry Database Connection after 5000ms\n`
      );
      setTimeout(() => {
        connectToDatabase();
      }, 5000);
    });
};

module.exports = connectToDatabase;
