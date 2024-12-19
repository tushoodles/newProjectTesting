const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true,
    },
    movie:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
    },
    image:{
        type:String,
    },
    imdb_url:{
        type:String,
    }
})


module.exports = mongoose.model('Movie',movieSchema);
