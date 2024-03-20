const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chats");
module.exports = (app, io) => {
  [userRoutes, chatRoutes].forEach((apiRoutes) =>
    app.use("/api/v1", apiRoutes(io))
  );
  module.exports = app;
};
