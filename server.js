/**
 * 
 */

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://localhost:27017/mydb');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    
    // define model =================
    var Coupon = mongoose.model('Coupon', {
        text : String
    });
    
 // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all coupons
    app.get('/api/coupons', function(req, res) {

        // use mongoose to get all coupons in the database
    	Coupon.find(function(err, coupons) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(coupons); // return all coupons in JSON format
        });
    });

    // Add coupon and send back all coupons after creation
    app.post('/api/coupons', function(req, res) {

        // Add a coupon
    	Coupon.create({
            text : req.body.text,
            done : false
        }, function(err, coupon) {
            if (err)
                res.send(err);

            // get and return all the coupons after you create another
            Coupon.find(function(err, coupons) {
                if (err)
                    res.send(err)
                res.json(coupons);
            });
        });

    });

    // delete a coupon
    app.delete('/api/coupons/:coupon_id', function(req, res) {
    	Coupon.remove({
            _id : req.params.coupon_id
        }, function(err, coupon) {
            if (err)
                res.send(err);

            // get and return all the coupons
            Coupon.find(function(err, coupons) {
                if (err)
                    res.send(err)
                res.json(coupons);
            });
        });
    });
    
    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");