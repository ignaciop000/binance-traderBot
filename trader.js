const express = require('express')
var app	= express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//require the body-parser library. will be used for parsing body requests
const bodyParser = require('body-parser')
//require the path library
const path    = require( 'path' );

const trading_lib = require('./trading');

// use the bodyparser as a middleware  
app.use(bodyParser.json())
// set port for the app to listen on
app.set( 'port', process.env.PORT || 3001 );
// set path to serve static files
app.use( express.static( path.join( __dirname, 'public' )));
// enable CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});
/*
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
*/

http.listen(app.get( 'port' ), function(){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
});

let optionsDefault = [{
	symbol:'VENBNB',
	quantity:0,
	stop_loss:0,
	mode:'profit',
	profit:1.3,
	increasing:0.00000001,
	decreasing:0.00000001,
	loop:0,
	wait_time:0.7,
	prints: 1,
},
{
	symbol:'ETHBTC',
	quantity:0,
	stop_loss:0,
	mode:'profit',
	profit:1.3,
	increasing:0.00000001,
	decreasing:0.00000001,
	loop:0,
	wait_time:0.7,
	prints: 1,
},
{
	symbol:'XVGBTC',
	quantity:0,
	stop_loss:0,
	mode:'profit',
	profit:1.3,
	increasing:0.00000001,
	decreasing:0.00000001,
	loop:0,
	wait_time:0.7,
	prints: 1,
}];

optionsDefault.forEach(function (optionDefault) {	
	var trading = new trading_lib.Trading(io, optionDefault);
	trading.run();
})


