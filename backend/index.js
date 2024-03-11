const express = require("express");
const http = require("http");
const routes = require("./routes");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

// Create an Express application
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Create a HTTP server using Express app
const server = http.createServer(app);

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware to add database instance to request object
app.use((req, res, next) => {
  req.db = pool;
  next();
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Error connecting to PostgreSQL database", err))
  .finally(() => {
    // Start the HTTP server only after database connection is established
    const PORT = process.env.PORT || 9000;
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  });

app.get("/", (req, res) => {
  res.send("Welcome to chat app");
});
app.use(routes);
