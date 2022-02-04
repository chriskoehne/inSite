/**
 * @fileoverview This file initializes and sets up all routes and methods for the backend to run
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

console.log("\x1b[36m%s\x1b[0m", "Starting BACKEND...");

const express = require("express");
const app = express();
const path = require("path");
var cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(express.json());


//TODO: put cors shit here

app.use(require(path.resolve(__dirname, "./routers/router")));

const dbConnection = require(path.resolve(__dirname, "./database/database"));


app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(PORT, () => {
  console.log("\x1b[36m%s\x1b[0m", "Startup Successful, BACKEND is ONLINE");
  console.log(`BACKEND listening on port ${PORT} uwu...`);
});