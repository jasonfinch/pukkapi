var express = require('express');
var Account = require('../models/account');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('profile', { user : req.user });

});

/* GET Userlist page. */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('Account');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET users profile. */
router.get('/profile', function(req, res, next) {
  res.render('profile', { user : req.user });

});

module.exports = router;
