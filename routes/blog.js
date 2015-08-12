var express = require('express');
var blog = require('../models/blog');
var passport = require('passport');
var timeago = require('timeago');
var router = express.Router();

router.get('/', function (req, res) { 
   
   blog.find({'draft': true}).sort('-date').exec( function(error,docs){   
        res.render('blog', {title: 'Blog', articles:docs, user:req.user});    
    })
});

// get single post route (by id)

router.get('/post/:post_id', function (req, res) {
 
    blog.findById(req.params.post_id, function (err, docs) {
        res.render('blog-post', {title: 'Blog', article:docs, user:req.user}); 
    });
});


module.exports = router;