const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");
const { CLIENT_ORIGIN } = require("./config/env");

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN === "*" ? true : CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use(express.static("public"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;