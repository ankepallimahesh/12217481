const mongoose = require('mongoose');
async function Database(){
    try{
     await mongoose.connect(process.env.MONGODB_URI);
     console.log('Database connected');
    }
    catch(err){
        console.log('failed to connect');
    }
}
module.exports = Database;
