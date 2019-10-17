var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
    title: {
        type:String,
        required: true,
        unique:true
    }
})