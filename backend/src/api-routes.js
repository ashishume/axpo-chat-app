const express = require("express");
const app = express();

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chats");

[userRoutes, chatRoutes].forEach((apiRoutes) => app.use("/api/v1", apiRoutes));
module.exports = app;
