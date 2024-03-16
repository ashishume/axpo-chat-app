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
    client.on("login", (conversationId) => {
      client.conversationId = conversationId;
      if (clientsData[conversationId]) {
        clientsData[conversationId].push(client);
      } else {
        clientsData[conversationId] = [client];
      }
      console.log(`connection established:${conversationId}`);
    });

    /** message communication */
    client.on("message", (messageData) => {
      const { senderId, targetId, message } = messageData;

      // Check if both sender and target are valid and not the same
      if (senderId && targetId && senderId !== targetId) {
        const conversationId = [senderId, targetId].sort().join("-"); // Unique identifier for the conversation

        // Send the message to all clients associated with the conversationId
        if (clientsData[conversationId]) {
          clientsData[conversationId].forEach((client) => {
            client.emit("message", messageData);
          });
        }
        if (clientsData[conversationId]) {
          clientsData[conversationId].forEach((client) => {
            client.emit("notification", {
              title: `New message`,
              body: message,
            });
          });
        }

        console.log(`message sent from ${senderId} to ${targetId}: ${message}`);
      }
    });

    /** connection disconnected */
    client.on("disconnect", () => {
      if (!client.conversationId || !clientsData[client.conversationId]) {
        return;
      }

      let conversationClients = clientsData[client.conversationId];
      for (let i = 0; i < conversationClients.length; ++i) {
        if (conversationClients[i] == client) {
          conversationClients.splice(i, 1);
        }
      }

      console.log(`connection disconnected:${client.conversationId}`);
    });
  });
};

exports.socketIOMiddleware = (req, res, next) => {
  req.io = io;
  next();
};
