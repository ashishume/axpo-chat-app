const express = require("express");
const { Message } = require("../db/db");
const router = express.Router();
/**
 * APTH PATH: /api/v1/chats/:roomId
 */
module.exports = (io) => {
  router.get("/chats/:roomId", async (req, res) => {
    try {
      const { roomId } = req.params;
      const chats = await Message.findAll({
        where: {
          roomId,
        },
      });
      return res.status(200).json(chats);
    } catch (err) {
      return res.status(500).send({
        message: "chat fetching failed",
        err,
      });
    }
  });
  return router;
};
