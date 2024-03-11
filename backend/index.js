const express = require("express");
const http = require("http");
const routes = require("./routes");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
// const socketIo = require("socket.io");
const socketUtils = require("./src/socket");
require("dotenv").config();
// Create an Express application
const app = express();

app.use(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
// Middleware to add database instance to request object
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Create a HTTP server using Express app
const server = http.createServer(app);
const io = socketUtils.io(server);
socketUtils.connection(io);
const socketIOMiddleware = (req, res, next) => {
  req.io = io;
  next();
};

app.get("/", socketIOMiddleware, (req, res) => {
  req.io.emit("message", `Hello, ${req.originalUrl}`);
  res.send("Welcome to chat app");
});
app.use(routes);

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
