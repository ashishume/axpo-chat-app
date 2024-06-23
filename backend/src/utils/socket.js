const socketIO = require("socket.io");
const pool = require("../utils/db-connect");

exports.io = (server) => {
  return socketIO(server, {
    transports: ["polling"],
    cors: {
      origin: "*",
    },
  });
};
exports.connection = (io) => {
  io.on("connection", (client) => {
    /** user logged in */
    client.on("login", ({ conversationId, targetId }) => {
      client.conversationId = conversationId;
      client.targetId = targetId;
      client.join(conversationId);
      console.log(`connection established:${conversationId}`);
    });

    /** message communication */
    client.on("message", async (messageData) => {
      const { senderId, targetId, message } = messageData;

      // Check if both sender and target are valid and not the same
      if (senderId && targetId && senderId !== targetId) {
        const conversationId = [senderId, targetId].sort().join("-"); // Unique identifier for the conversation
        // Send the message to the room corresponding to the conversationId
        io.to(conversationId).emit("message", messageData);
        io.to(conversationId).emit("notification", {
          title: `New message`,
          body: message,
          targetId,
        });
        if (conversationId) {
          await updateDatabaseTable(messageData, conversationId);
        }
        console.log(`message sent from ${senderId} to ${targetId}: ${message}`);
      }
    });

    /** connection disconnected */
    client.on("disconnect", () => {
      if (client.conversationId) {
        // Leave the room corresponding to the conversationId
        client.leave(client.conversationId);
        console.log(`connection disconnected:${client.conversationId}`);
      }
      console.log(`connection disconnected:${client.conversationId}`);
    });

    //TODO: use room based approach for chatting
    // client.on("login", ({ userId }) => {
    //   // Join a room based on the user's ID
    //   client.join(userId);

    //   // Handle onlineStatus event for the specific user
    //   client.on("onlineStatus", ({ isOnline }) => {
    //     // Emit the online status to all clients in the same room (user's ID)
    //     io.to(userId).emit("onlineStatus", { userId, isOnline });
    //   });
    // });
  });
};

/**
 * store the chats to the database
 * @param {*} messageData
 * @param {*} conversationId
 */
const updateDatabaseTable = async (messageData, conversationId) => {
  try {
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
  } catch (e) {
    console.log(e);
    throw e;
  }
};
