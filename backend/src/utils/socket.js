const socketIO = require("socket.io");
// const pool = require("../utils/db-connect");
const { Message } = require("../db/db");

exports.io = (server) => {
  return socketIO(server, {
    transports: ["websocket", "polling"],
    cors: {
      origin: "*",
    },
  });
};
exports.connection = (io) => {
  io.on("connection", (client) => {
    /** user logged in */
    client.on("login", ({ roomId, userId }) => {
      client.roomId = roomId;
      client.userId = userId;
      client.join(roomId);
      console.log(`connection established:${roomId}`);
    });

    /** message communication */
    client.on("message", async (messageData) => {
      const { userId, message } = messageData;

      if (userId && message && client.roomId) {
        io.to(client.roomId).emit("message", messageData);
        // io.to(roomId).emit("notification", {
        //   title: `New message`,
        //   body: message,
        //   targetId,
        // });
        await updateMessagesToDB(messageData, client.roomId);
      }
    });

    /** connection disconnected */
    client.on("disconnect", () => {
      if (client.roomId) {
        // Leave the room corresponding to the roomId
        client.leave(client.roomId);
        console.log(`connection disconnected:${client.roomId}`);
      }
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
const updateMessagesToDB = async (messageData, roomId) => {
  try {
    const { userId, message } = messageData;
    const messages = await Message.create({
      message,
      roomId,
      userId,
    });
  } catch (err) {
    console.log({ message: "message sending failed", err });
    throw err;
  }
};
