//Libreries Node
var https   = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var dateFormat = require('dateformat');

//Config
var app     = express();
var ip      = 'http://192.168.1.93';
var port    = process.env.PORT || 8800;
var router  = express.Router();

app.use(session(
    {
        secret: 'glv2017',
        resave: true,
        saveUninitialized: true
    }
));

//Controller
router.use(function(req, res, next){
    console.log(req.method, req.url);
    sess = req.session;
    next();
});

router.get('/', function(req, res){
    var before=0;
    sess = req.session;
    sess.price=0;
    function intervalFunc () {
	  	var options = {
	        "rejectUnauthorized": false,
	        host: 'api.bitso.com',	
	        path: '/v3/ticker/?book=eth_mxn',
	        method: 'GET',
	        headers: {
	        	"content-type":"application/json"
	        }
	    };
	 
	    var GetReq = https.request(options, function(GetRes) {
	        GetRes.on('data', function(chunk) {
	        	var day= dateFormat(Date.now());
	        	var eth = JSON.parse(chunk);
	        		if (sess.price != eth.payload.last ) {
	        			sess.price = eth.payload.last;
	        			console.log(day+' | '+sess.price);
	        		};	          
	        });
	    });

	    GetReq.end();
	    GetReq.on('error', function(e) {
	        console.error(e);   
	        end(JSON.stringify(e));
	    });
	}
	setInterval(intervalFunc, 1500);
});

//Server On
app.use('/', router);
//Starter Server
app.listen(port);
