const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    author:{
        type:Number,
    },
    date_published:{
        type:Date,
    },
    content:{
        type:String,
    }
})


module.exports = mongoose.model('BLOG',movieSchema);
