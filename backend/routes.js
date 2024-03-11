const express = require("express");
const app = express();

const userRoutes = require("./src/routes/user");

[userRoutes].forEach((apiRoutes) => app.use("/api/v1", apiRoutes));
module.exports = app;
