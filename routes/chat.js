var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
	 res.render('chat', { user : req.user });
});

router.get('/room', function(req, res){
	 res.sendFile(__dirname + '/index.html', { user : req.user })
});

module.exports = router;
