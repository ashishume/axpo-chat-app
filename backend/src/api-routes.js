// const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chats");
const newUsersRoutes = require("./routes/users-sq");
const roomRoutes = require("./routes/rooms");
module.exports = (app, io) => {
  [chatRoutes, newUsersRoutes, roomRoutes].forEach((apiRoutes) =>
    app.use("/api/v1", apiRoutes(io))
  );
  module.exports = app;
};
