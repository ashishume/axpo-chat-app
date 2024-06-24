const express = require("express");
const pool = require("../utils/db-connect");
const router = express.Router();
module.exports = (io) => {
  /**
   * APTH PATH: /api/v1/users-with-last-message
   */
  router.get("/users-with-last-message", async (request, response) => {
    try {
      const { userId } = request.query;
      const query = `
      SELECT 
        u.id,
        u.name,
        c.message AS "lastMessage"
      FROM 
        users u
      LEFT JOIN (
        SELECT 
          "senderId",
          MAX(id) AS max_id
        FROM 
          chats
        WHERE
          "targetId" = $1
        GROUP BY 
          "senderId"
      ) latest ON u.id = latest."senderId"
      LEFT JOIN chats c ON latest.max_id = c.id
      WHERE
        u.id <> $1 
      ORDER BY 
        u.id ASC;
    `;
      const values = [userId];
      const result = await pool.query(query, values);
      response.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching users with last message:", error);
      response.status(500).json({ message: "Something went wrong" });
    }
  });

  return router;
};
