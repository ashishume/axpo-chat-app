// const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chats");
const newUsersRoutes = require("./routes/users-sq");
module.exports = (app, io) => {
  [chatRoutes, newUsersRoutes].forEach((apiRoutes) =>
    app.use("/api/v1", apiRoutes(io))
  );
  module.exports = app;
};
