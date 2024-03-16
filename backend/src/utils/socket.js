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

exports.socketIOMiddleware = (req, res, next) => {
  req.io = io;
  next();
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

  // pool.query(
  //   "SELECT conversationId FROM chats WHERE conversationId=$1",
  //   [conversationId],
  //   (error, results) => {
  //     if (error) {
  //       throw error;
  //     }
  // if (!results.rowCount) {
    pool.query(
      'INSERT INTO chats (message, "senderId", "targetId", "conversationId") VALUES ($1, $2, $3, $4) RETURNING *',
      [message, senderId, targetId, conversationId],
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );
  // }
  // } else {
  // const updateChatByConversationId = async () => {
  //   try {
  //     const query = `
  //       UPDATE chats
  //       SET message = $1,
  //           senderId = $2,
  //           targetId = $3
  //       WHERE conversationId = $4
  //     `;
  //     const values = [message, senderId, targetId, conversationId];
  //     await pool.query(query, values);
  //   } catch (e) {
  //     throw e;
  //   }
  // };

  // updateChatByConversationId();
  // }
  // }
  // );
};
