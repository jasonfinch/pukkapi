// /models/phonedata-api.js

// data base model phone date locations etc.... for the 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhoneSchema = new Schema({
	    location: String,
		loc: String,
		battery:    String,
		signal: String,
		phonedate: String,
		day_of_month: String,
        cell_id: String,
        cell_status: String,
        time: String,
        luminosity: String,
        altitude: String,
        pressure: String,
        mem: String,
		date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Phone', PhoneSchema);
