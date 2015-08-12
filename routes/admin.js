var express = require('express');
var passport = require('passport');
var ensure = require('connect-ensure-login');
var fs = require('fs');
var util = require("util"); 
var multer = require('multer');
var request = require('request');
var cheerio = require('cheerio');
var Blog = require('../models/blog');
var Phone = require('../models/phonedata-api');
var Todo  = require( '../models/todo' );
var Account = require('../models/account');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// middleware function placed directly on route, initialized by multer
var upload = multer({ dest: './public/images/app/' });

router.get('/',
	ensure.ensureLoggedIn('/auth/login'),
	function(req, res) {
		res.render('admin', { user: req.user, role: req.isAdmin });
});

// blog routes

router.get('/blog', function(req, res){ 
	 Blog.find({}).sort('-date').exec( function(error,docs){   
				res.render('admin-blog', {title: 'Blog', articles:docs, user:req.user});    
		})
});
	
router.get('/blog/new', function(req, res) {
		 res.render('admin-blog-new.jade', { user: req.user, role: req.isAdmin });
});

router.post('/blog/new', function(req, res){

 // save the item
        var content = req.body.content; 
        var intro = content.substr(0, 200)
        var blog = new Blog();
        blog.title = req.body.title;
        blog.content = req.body.content;
        blog.intro = intro
        blog.author = req.body.author;
        //blog.tags(); = req.body.tags; 
        blog.draft = req.body.draft;
        blog.save(function(err) {
            if(err) 
	res.send(err); 
        res.redirect('back');
    })
});

// get single post route (by id)

router.get('/blog/post/:post_id', function (req, res) {
 
        Blog.findById(req.params.post_id, function (err, docs) {
        res.render('admin-blog-post', {title: 'Blog', article:docs, user:req.user}); 
     });
 });

// update the blog post with this id (accessed at PUT http://localhost:8080/api/phone-data/phone_id)
 router.put('/blog/post/:post_id', function(req, res) {

        // use our Blog model to find the bear we want
        Blog.findById(req.params.post_id, function(err, docs) {

            if (err)
                res.send(err);

            Blog.title = req.body.title;  // update the location info

            // save the post title
            Blog.save(function(err) {
                if (err)
                    res.send(err);

                res.redirect('back');
            });

        });
});

 // delete the post with this id
router.post('/blog/post/delete/:post_id', function(req, res) {
        Blog.findByIdAndRemove(req.params.post_id, function(err) {
             if (err) throw err;

        // we have deleted the post
            console.log('Post deleted!');
            res.redirect('back');
            })
});

	// user

router.get('/user/new', function(req, res) {
		res.render('register', { user: req.user, role: req.isAdmin });
});

router.post('/user/new', function(req, res, next) {
		Account.register(new Account({ username : req.body.username, email : req.body.email }), req.body.password, function(err, account) {
				if (err) {
					return res.render("register", {info: "Sorry. That username already exists. Try again."});
				}

				passport.authenticate('local')(req, res, function () {
						req.session.save(function (err) {
								if (err) {
										return next(err);
								}
								res.redirect('/admin');
						});
				});
		});
});

router.get('/users', function(req, res){ 
	 Account.find({}).sort('-date').exec( function(error,users){   
				res.render('admin-users', {title: 'Users', users:users, user:req.user});    
		})
});

router.get('/users/profile/:username', function(req, res){ 
	 Account.find({user:req.user}).sort('-date').exec( function(error,users){   
				res.render('profile', {title: 'Users', users:users, user:req.user});    
		})
});

// phone data routes
// get all the phone data
router.get('/phone-data/', function(req, res) {
        Phone.find(function(err, docs) {
            if (err)
                res.send(err);

            res.render('admin-phonedata-all', {phones:docs});
        });
    });

// to do routes

// All todo Routes
//router.use( routes.current_user );

// todos
//router.get(  '/todos',            routes.index );

// create todo
//router.post( '/todos/create',      routes.create );

// delete todo
//router.get(  '/todos/destroy/:id', routes.destroy );

// edit todo
//router.get(  '/todos/edit/:id',    routes.edit );

// update todo
//router.post( '/todos/update/:id',  routes.update );

// All upload routes

router.get('/upload', ensure.ensureLoggedIn('/auth/login'), function(req, res) { 
    res.render("upload", {title: "I love files!"}); 
}); 


router.get('/upload', ensure.ensureLoggedIn('/auth/login'), function(req, res) { 
 res.render("upload", {title: "I love files!"}); 
}); 
 
router.post('/upload', upload.single('myFile'), function (req, res, next) {
  //req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
     res.render("upload", {title: "I love files!",message: "Upload complete."}); 
});

// settings/config
router.get('/settings', ensure.ensureLoggedIn('/auth/login'), function(req, res) {
		fs.readFile('../bin/config/default.json', 'utf8', function(err, contents) {
    console.log(contents);
    var jsonContent = JSON.parse(contents); // parse the json contents
    console.log("User Name:", jsonContent.config.app.dbconfig.host);
});
console.log('after calling readFile');

		res.render('admin-settings', { user: req.user, role: req.isAdmin });
	});

// status and test

router.get('/status', ensure.ensureLoggedIn('/auth/login'), function(req, res) {
		res.render('admin-status', { user: req.user, role: req.isAdmin });
	});

router.get('/test/ping', ensure.ensureLoggedIn('/auth/login'), function(req, res){
		res.status(200).send("Server ping successful!");
}); 
module.exports = router;
