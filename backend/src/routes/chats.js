const express = require("express");
const { pool, tableExists, createChatTable } = require("../utils/sql-queries");
const router = express.Router();
/**
 * APTH PATH: /api/v1/chats
 */
router.get("/chats", async (request, response) => {
  const { conversationId } = request.query;
  // Check if the table exists, if not, create it
  if (!(await tableExists("chats"))) {
    await createChatTable();
  }
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
module.exports = router;
