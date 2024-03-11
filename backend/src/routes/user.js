const express = require("express");
const { createUserTable, tableExists, pool } = require("../utils/sql-queries");
const router = express.Router();

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

router.get("/user/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT id,email,name FROM users WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json({ user: results.rows });
    }
  );
});

router.post("/user", async (request, response) => {
  const { name, email, password } = request.body;
  // const tableExists = await checkIfTableExists();

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
