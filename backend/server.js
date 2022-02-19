/**
 * @fileoverview This file initializes and sets up all routes and methods for the backend to run
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

console.log("\x1b[36m%s\x1b[0m", "Starting BACKEND...");

const express = require("express");
const path = require("path");
var cors = require("cors");
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000; //config port in env or jwt (dotenv required)

const app = express();

app.use(express.json());
app.use(cookieParser());


const corsOptions ={
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


app.use(require(path.resolve(__dirname, "./routers/router")));

const dbConnection = require(path.resolve(__dirname, "./database/database"));


app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(PORT, () => {
  console.log("\x1b[36m%s\x1b[0m", "Startup Successful, BACKEND is ONLINE");
  console.log(`BACKEND listening on port ${PORT} uwu...`);
});