// /routes/api.js

// All api routes

// add authorization
var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var blog = require('../models/blog');
var Account = require('../models/account');
var Phone = require('../models/phonedata-api');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});



// Api Routes

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// phone data

    // create a bear (accessed at POST http://localhost:8080/api/bears)
 router.post('/phone-data', function(req, res) {
        
        var phone = new Phone();      // create a new instance of the Bear model
        phone.loc = req.body.loc;  // set the bears name (comes from the request)
        phone.battery = req.body.battery;
        phone.signal = req.body.signal;
        phone.day_of_month = req.body.dom;
        phone.phonedate = req.body.phonedate;
        phone.time = req.body.time;
        phone.luminosity = req.body.luminosity;
        phone.pressure = req.body.pressure;
        phone.altitude = req.body.altitude;
        phone.cell_id = req.body.cell_id;
        phone.cell_status = req.body.cell_status;
        phone.mem = req.body.mem;
// save the bear and check for errors
        phone.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Location saved!' });
        });
        
    });

// get all the bears (accessed at GET http://localhost:8080/api/bears)
router.get('/phone-data', function(req, res) {
        Phone.find(function(err, phones) {
            if (err)
                res.send(err);

            res.json(phones);
        });
    });

// on routes that end in /phone-data/:phone_id
// ----------------------------------------------------

    // get the phone data with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
router.get('/phone-data/:phone_id', function(req, res) {
        Phone.findById(req.params.phone_id, function(err, phone) {
            if (err)
                res.send(err);
            res.json(phone);
        });
    });

// update the phone info with this id (accessed at PUT http://localhost:8080/api/phone-data/phone_id)
 router.put('/phone-data/:phone_id', function(req, res) {

        // use our bear model to find the bear we want
        Phone.findById(req.params.phone_id, function(err, phone) {

            if (err)
                res.send(err);

            phone.loc = req.body.loc;  // update the location info

            // save the phone
            phone.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Phone data location updated!' });
            });

        });
});

 // delete the phone data with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    router.delete('/phone-data/:phone_id', function(req, res) {
        Phone.remove({
            _id: req.params.phone_id
        }, function(err, phone) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
module.exports = router;