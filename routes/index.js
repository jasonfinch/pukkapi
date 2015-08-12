var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var passport = require('passport');
var router = express.Router();



router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/about', function (req, res) {
    res.render('about', { user : req.user });
});


router.get('/home', function (req, res) {
	url = 'http://192.168.0.1';
    request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = scrapeDataFromHtml(body);
            res.send(data);
        }
        return console.log(error);
    });
});

var scrapeDataFromHtml = function(html) {
    var data = {};

    var $ = cheerio.load(html);
    var device = $('td', '.header').text().trim();
    var connection = $('td', '.header').eq(2).text().trim();
   

    data = {
        device: device,
        connection : connection,
      
    };
    return data;
};

module.exports = router;
