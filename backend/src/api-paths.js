const express = require("express");
const app = express();
const user = require("./routes/user");

[user].forEach((apiRoutes) => app.use("/api/v1", apiRoutes));
module.exports = app;
