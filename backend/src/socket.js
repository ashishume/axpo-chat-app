const socketIO = require("socket.io");

exports.io = (server) => {
  return socketIO(server, {
    transports: ["polling"],
    cors: {
      origin: "*",
    },
  });
};

exports.connection = (io) => {
  io.on("connection", (socket) => {
    socket.on("message", (message) => {
      console.log(`message from ${socket.id} : ${message}`);
      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log(`socket ${socket.id} disconnected`);
    });
  });
};
