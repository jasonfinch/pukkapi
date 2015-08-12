// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var helpers = require('express-helpers')(app);
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var timeago = require('timeago');

// grab config from /bin/config/default.json
var config = require('config');

// require routers
var routes = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var chat = require('./routes/chat');
var blog = require('./routes/blog');
var admin = require('./routes/admin');
var api = require('./routes/api');
var sandbox = require('./routes/sandbox');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', routes);
app.use('/users', users)
app.use('/chat', chat)
app.use('/auth', auth)
app.use('/blog', blog)
app.use('/admin', admin)
app.use('/api', api)
app.use('/sandbox', sandbox)

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
// database setup is in /bin/config/default.json
var dbUrl = config.get('app.dbConfig.host');
mongoose.connect(dbUrl);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Sorry Dave, the page you was looking for was not found :(');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
