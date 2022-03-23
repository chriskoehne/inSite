const mongoose = require("mongoose");
const uri = process.env.DATABASE_URI;
console.log('uri is')
console.log(uri)

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