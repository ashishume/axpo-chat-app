const express = require("express");
const pool = require("../utils/db-connect");
const router = express.Router();
/**
 * APTH PATH: /api/v1/chats
 */
module.exports = (io) => {
  router.get("/chats", async (request, response) => {
    const { conversationId } = request.query;
  
    pool.query(
      'SELECT * FROM chats WHERE "conversationId" = $1',
      [conversationId],
      (error, results) => {
        if (error) {
          return response.status(500).send({
            message: "Something went wrong",
          });
        }
        return response.status(200).json(results.rows);
      }
    );
  });
  return router;
};
