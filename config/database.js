const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { cronDaily } = require("../utils/cron/cronDaily");
dotenv.config();

const connectToDatabase = async () => {
  mongoose
    .connect(process.env.MONGO_URL, {
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
