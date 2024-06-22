const express = require("express");
const pool = require("../utils/db-connect");
const router = express.Router();
module.exports = (io) => {
  /**
   * APTH PATH: /api/v1/users
   */
  router.get("/users", async (request, response) => {
    pool.query(
      "SELECT id,email,name FROM users ORDER BY id ASC",
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  });

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

  /**
   * APTH PATH: /api/v1/login
   */
  router.post("/login", (request, response) => {
    const { email, password } = request.body;
    pool.query(
      "SELECT id, email, name FROM users WHERE email = $1 AND password = $2",
      [email, password],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results?.rowCount) {
          response
            .status(200)
            .json({ message: "auth successful", user: results.rows[0] });
        } else {
          response.status(401).json({ message: "auth failed" });
        }
      }
    );
  });

  /**
   * APTH PATH: /api/v1/user/<id>
   */
  router.get("/user/:id", async (request, response) => {
    const id = parseInt(request.params.id);

    pool.query(
      "SELECT id,email,name FROM users WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          return response.status(401).json({
            message: "user not found",
          });
        }
        response.status(200).json(results.rows[0]);
      }
    );
  });

  /**
   * APTH PATH: /api/v1/signup
   */
  router.post("/signup", async (request, response) => {
    const { name, email, password } = request.body;

    // Insert user into the database
    pool.query(
      "SELECT email FROM users WHERE email=$1",
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (!results.rowCount) {
          pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, password],
            (error, results) => {
              if (error) {
                throw error;
              }
              response
                .status(201)
                .send(`User added with ID: ${results.rows[0].id}`);
            }
          );
        } else {
          response.status(403).send({
            message: "User already registered",
          });
        }
      }
    );
  });

  return router;
};
