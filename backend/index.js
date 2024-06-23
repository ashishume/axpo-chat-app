const express = require("express");
const http = require("http");
const routes = require("./src/api-routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketUtils = require("./src/utils/socket");
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

// Create a HTTP server using Express app
const server = http.createServer(app);

const io = socketUtils.io(server);

socketUtils.connection(io);

app.get("/", (req, res) => {
  res.send("Welcome to chat app");
});

/** all the api routes */
routes(app, io);


// Start the HTTP server only after database connection is established
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
