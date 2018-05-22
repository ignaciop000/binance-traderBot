const express = require('express')
var app	= express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//require the body-parser library. will be used for parsing body requests
const bodyParser = require('body-parser')
//require the path library
const path    = require( 'path' );

const trading_lib = require('./trading');
const Orders = require('./orders');
const coins = require('./coins');

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
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/profits/:symbol', async function(req, res){
	//let coins = 
  	let symbol = req.params.symbol;
  	let coins = await Orders.get_products();
  	let profits = []
  	for (let coin of coins.data) {
  		if (coin.quoteAsset == symbol) {
  			let last = await Orders.get_order_book(coin.symbol)
            let profit = (last.lastAsk - last.lastBid) /  last.lastBid * 100
            profits.push({symbol: coin.symbol, profit:profit ,lastBid:last.lastBid,lastAsk:last.lastAsk });
  		}
  	}	
  	res.render('profits', {symbol :symbol, profits: profits });
});

app.get('/account', async function(req, res){
  	let account = await Orders.get_account();
  	res.render('account', { account: account });
});

io.on('connection', async function(socket){
	let orders = await Orders.openOrders()
	console.log(orders);
//  socket.on('disconnect', function(){
//    console.log('user disconnected');
//  });
});


http.listen(app.get( 'port' ), function(){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
});

let optionsDefault = coins;

optionsDefault.forEach(function (optionDefault) {	
	var trading = new trading_lib.Trading(io, optionDefault);
	trading.run();
})


