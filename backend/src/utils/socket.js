const socketIO = require("socket.io");
// const pool = require("../utils/db-connect");
const { Message } = require("../db/db");

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
    client.on("login", ({ roomId, senderId }) => {
      client.roomId = roomId;
      client.senderId = senderId;
      client.join(roomId);
      console.log(`connection established:${roomId}`);
    });

    /** message communication */
    client.on("message", async (messageData) => {
      const { senderId, message } = messageData;

      if (senderId && message) {
        io.to(client.roomId).emit("message", messageData);
        // io.to(roomId).emit("notification", {
        //   title: `New message`,
        //   body: message,
        //   targetId,
        // });
        if (client.roomId) {
          await updateMessagesToDB(messageData, client.roomId);
        }
        // console.log(`message sent from ${senderId} to ${targetId}: ${message}`);
      }
    });

    /** connection disconnected */
    client.on("disconnect", () => {
      if (client.roomId) {
        // Leave the room corresponding to the roomId
        client.leave(client.roomId);
        console.log(`connection disconnected:${client.roomId}`);
      }
      console.log(`connection disconnected:${client.roomId}`);
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
    const { senderId, message } = messageData;
    const messages = await Message.create({
      message,
      roomId,
      userId: senderId,
    });

    console.log("message added", messages);
  } catch (err) {
    console.log({ message: "message sending failed", erro });
    throw err;
  }
};
