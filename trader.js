const express = require('express')
const sprintf = require("sprintf-js").sprintf;
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
const { BinanceWS } = require('./binanceapi');
const { generateCurrency, print} = require('./utils');

var price_list = [];
var first_run_flag = true;

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

const ONE_S_PRICE_DIFFERENCE_THRESHOLD = 1.0;
const TEN_S_PRICE_DIFFERENCE_THRESHOLD = 0.75;
const FIFTEEN_S_PRICE_DIFFERENCE_THRESHOLD = 1.0
const VOLUME_DIFFERENCE_THRESHOLD = 1.0;
const MINIMUM_VOLUME_THRESHOLD = 800.0

let PRICE_DIFFERENCE_THRESHOLD = [];
PRICE_DIFFERENCE_THRESHOLD["10"] = 0.75;
PRICE_DIFFERENCE_THRESHOLD["15"] = 1.0;
PRICE_DIFFERENCE_THRESHOLD["20"] = 1.4;
PRICE_DIFFERENCE_THRESHOLD["30"] = 1.8;
PRICE_DIFFERENCE_THRESHOLD["60"] = 2.1;
PRICE_DIFFERENCE_THRESHOLD["120"] = 2.5;
PRICE_DIFFERENCE_THRESHOLD["300"] = 3.0;
PRICE_DIFFERENCE_THRESHOLD["600"] = 3.5;
PRICE_DIFFERENCE_THRESHOLD["900"] = 4.0;

new BinanceWS().initSocket("!ticker@arr", function(msg) {
  let asset = 'BTC';
  let aSecs = ["10", "15", "20"];  
  for (let currency of JSON.parse(msg)) {
    let objCurrency = generateCurrency(currency);
    
    let quoteAsset = objCurrency.symbol.slice(-1*asset.length);
    if (quoteAsset == asset) {
      if (first_run_flag) {
        price_list[objCurrency.symbol] = objCurrency;
      } else {
        let stored_currency = price_list[objCurrency.symbol];
        if (stored_currency != undefined) {
          let ct = new Date().getTime();
          if (ct - stored_currency.time_stamp > 1000) {          
            let priceDiff = ((objCurrency.bid_price - stored_currency.bid_price) / stored_currency.bid_price) * 100
            let volDiff = ((objCurrency.volume - stored_currency.volume) / stored_currency.volume) * 100
            if(priceDiff > ONE_S_PRICE_DIFFERENCE_THRESHOLD && volDiff > VOLUME_DIFFERENCE_THRESHOLD && objCurrency.volume > MINIMUM_VOLUME_THRESHOLD) {              
              let msg = sprintf("PRICE AND VOLUME! - SYMBOL: %s PRICE DIFF: %.8f VOLUME DIFF: %.8f VOLUME: %.8f",stored_currency.symbol,priceDiff, volDiff, objCurrency.volume)
              print("%s", msg);
              io.emit('scanner',{message:msg, type:'success'});      
            } else if (priceDiff > ONE_S_PRICE_DIFFERENCE_THRESHOLD && objCurrency.volume > MINIMUM_VOLUME_THRESHOLD) {              
              let msg = sprintf("PRICE! - SYMBOL: %s PRICE DIFF: %.8f VOL: %.8f",stored_currency.symbol,priceDiff, objCurrency.volume)
              print("%s", msg);
              io.emit('scanner',{message:msg, type:'success'});          
            } else  if (volDiff > VOLUME_DIFFERENCE_THRESHOLD && objCurrency.volume > MINIMUM_VOLUME_THRESHOLD) {              
              let msg = sprintf("VOLUME! - SYMBOL: %s VOLUME DIFF: %.8f VOL: %.8f",stored_currency.symbol, volDiff, objCurrency.volume)
              print("%s", msg);
              io.emit('scanner',{message:msg, type:'success'});     
            }
            for (let sec of aSecs) {
              if ((ct - stored_currency[sec].time_stamp) >= stored_currency[sec].time) {
                let price_diff = ((objCurrency.bid_price - stored_currency[sec].start_bid_price) / stored_currency[sec].start_bid_price) * 100;
                if (price_diff > PRICE_DIFFERENCE_THRESHOLD[sec]) {
                  let msg = sprintf("%s - SYMBOL: %s DIFF: %.8f",stored_currency[sec].flag,stored_currency.symbol,priceDiff, price_diff)
                  print("%s", msg);
                  io.emit('scanner',{message:msg, type:'success'});    
                }
                stored_currency[sec].start_bid_price = objCurrency.bid_price
                stored_currency[sec].time_stamp = ct
              }
            }
            
            stored_currency.bid_price = objCurrency.bid_price
            stored_currency.ask_price = objCurrency.ask_price
            stored_currency.volume = objCurrency.volume
            stored_currency.time_stamp = ct
            price_list[objCurrency.symbol] = objCurrency;
          }
        } else {
          price_list[objCurrency.symbol] = objCurrency;
        }
      }
    }
  }
  first_run_flag = false;
});

optionsDefault.forEach(function (optionDefault) {	
	var trading = new trading_lib.Trading(io, optionDefault);
	trading.run();
})


