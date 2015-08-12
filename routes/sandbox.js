// /routes/sandbox.js

// All Sandbox and public project routes

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) { 
    
        res.render('sandbox');    
});

module.exports = router;