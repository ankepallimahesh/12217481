const mongoose = require('mongoose');
const schema = mongoose.Schema({
    original:{
        type:String,
        required:true
    },
    short:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true
    }

},{timestamps:true});

const Shortner = mongoose.model('Shortner',schema);
module.exports = Shortner;
