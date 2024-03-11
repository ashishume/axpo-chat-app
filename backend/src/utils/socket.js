const socketIO = require("socket.io");

exports.io = (server) => {
  return socketIO(server, {
    transports: ["polling"],
    cors: {
      origin: "*",
    },
  });
};
let clientsData = {};
exports.connection = (io) => {
  io.on("connection", (client) => {
    /** user logged in */
    client.on("login", (senderId) => {
      client.senderId = senderId;
      if (clientsData[senderId]) {
        clientsData[senderId].push(client);
      } else {
        clientsData[senderId] = [client];
      }
      console.log(`connection established:${senderId}`);
    });

    /** message communication */
    client.on("message", (messageData) => {
      const { senderId, targetId } = messageData;
      if (targetId && clientsData[targetId]) {
        clientsData[targetId].forEach((client) => {
          client.emit("message", messageData);
        });
      }
      if (senderId && clientsData[senderId]) {
        clientsData[senderId].forEach((client) => {
          client.emit("message", messageData);
        });
      }
      console.log(
        `message sent/received senderId:${senderId}, targetId:${targetId}`
      );
    });

    /** connection disconnected */
    client.on("disconnect", () => {
      if (!client.senderId || !clientsData[client.senderId]) {
        return;
      }

      let targetClients = clientsData[client.senderId];
      for (let i = 0; i < targetClients.length; ++i) {
        if (targetClients[i] == client) {
          targetClients.splice(i, 1);
        }
      }

      console.log(`connection disconnected:${client.senderId}`);
    });
  });
};

exports.socketIOMiddleware = (req, res, next) => {
  req.io = io;
  next();
};
