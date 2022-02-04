const mongoose = require("mongoose");
const path = require("path");
const config = require(path.resolve(__dirname, "../config.json"));


const uri = config.databaseURI;

mongoose.connect(uri, {
    useNewUrlParser: true}).then(
    () => { 
        /* ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
        console.log('MongoDB connected...');
        
    },
    err => {
         /* handle initial connection error */ 
         console.log('error connecting to MongoDB...: ')
         console.log(err);   
        }
  );


module.exports = mongoose.connection;