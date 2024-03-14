const express = require("express");
const { createUserTable, tableExists, pool } = require("../utils/sql-queries");
const router = express.Router();

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
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
});

/**
 * APTH PATH: /api/v1/signup
 */
router.post("/signup", async (request, response) => {
  const { name, email, password } = request.body;

  // Check if the table exists, if not, create it
  if (!(await tableExists("users"))) {
    await createUserTable();
  }

  // Insert user into the database
  pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
});
module.exports = router;
