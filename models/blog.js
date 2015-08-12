
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
		title: String,
		content:    String,
        intro: String,
		url:    String,
		author: String,
		comments: [{ body: String, date: Date }],
		date: { type: Date, default: Date.now },
		tags: Array,
		draft: {type: Boolean, default: false}
});

// make this available to our users in our Node applications
module.exports = mongoose. model('Blog', blogSchema);


