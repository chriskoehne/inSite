/**
 * @fileoverview This file initializes and sets up all routes and methods for the backend to run
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

console.log('\x1b[36m%s\x1b[0m', 'Starting BACKEND...');

const express = require('express');
var cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config()
var hallMonitor = require('./hallMonitor/hallMonitor');

const PORT = process.env.PORT || 5000; //config port in env or jwt (dotenv required)

const server = express();

server.use(express.json({limit: '50mb'}));
server.use(cookieParser());

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://127.0.0.1:3000',
    'https://d33jcvm0fuhn35.cloudfront.net'
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

server.use(cors(corsOptions)); // Use this after the variable declaration

server.use('/api', require('./routers/router'));

require('./database/database');

server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', 'Startup Successful, BACKEND is ONLINE');
  console.log(`BACKEND listening on port ${PORT} uwu...`);
});

setInterval(hallMonitor.monitor, 60000); // every 60 seconds
setInterval(hallMonitor.socialsData, 30000);
setInterval(hallMonitor.socialsDataTwitter, 960000);
