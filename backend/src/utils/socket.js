const socketIO = require("socket.io");
const { createChatTable, tableExists, pool } = require("./sql-queries");

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
    client.on("login", ({ conversationId, targetId }) => {
      client.conversationId = conversationId;
      client.targetId = targetId;
      if (clientsData[conversationId]) {
        clientsData[conversationId].push(client);
      } else {
        clientsData[conversationId] = [client];
      }
      console.log(`connection established:${conversationId}`);
    });

    /** message communication */
    client.on("message", async (messageData) => {
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
              targetId,
            });
          });
        }
        if (conversationId) {
          await updateDatabaseTable(messageData, conversationId);
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

/**
 * store the chats to the database
 * @param {*} messageData
 * @param {*} conversationId
 */
const updateDatabaseTable = async (messageData, conversationId) => {
  // Check if the table exists, if not, create it
  if (!(await tableExists("chats"))) {
    await createChatTable();
  }

  const { message, senderId, targetId } = messageData;

  pool.query(
    'INSERT INTO chats (message, "senderId", "targetId", "conversationId") VALUES ($1, $2, $3, $4) RETURNING *',
    [message, senderId, targetId, conversationId],
    (error, results) => {
      if (error) {
        throw error;
      }
    }
  );
};
