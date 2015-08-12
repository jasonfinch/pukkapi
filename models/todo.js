// /models/todo.js
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var TodoSchema = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date
});

module.exports = mongoose.model('Todo', TodoSchema);