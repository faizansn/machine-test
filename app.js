const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { CustomError } = require("./utils/customError");
const cors = require("cors");
const http = require("http");
const indexRouter = require("./src/routes/index");
const { socketConnection } = require("./config/socket");

const app = express();
const server = http.createServer(app);

// socket connection
socketConnection(server); 

require("./config/socket");

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ statusCode: err.statusCode, error: err.message });
  }
  // render the error page
  res.status(err.status || 500).send({
    statusCode: err.statusCode,
    error: err.name,
    message: err.message,
  });
});

module.exports = app;
