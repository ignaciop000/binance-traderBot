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
const VOLUME_DIFFERENCE_THRESHOLD = 1.0;
const MINIMUM_VOLUME_THRESHOLD = 800.0

new BinanceWS().initSocket("!ticker@arr", function(msg) {
  let asset = 'BTC';  
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
          if (ct - stored_currency.time_stamp > 1) {          
            let priceDiff = ((objCurrency.bid_price - stored_currency.bid_price) / stored_currency.bid_price) * 100
            let volDiff = ((objCurrency.volume - stored_currency.volume) / stored_currency.volume) * 100
            //console.log(objCurrency.symbol,priceDiff,volDiff,objCurrency.volume  )
            if(priceDiff > ONE_S_PRICE_DIFFERENCE_THRESHOLD && volDiff > VOLUME_DIFFERENCE_THRESHOLD && objCurrency.volume > MINIMUM_VOLUME_THRESHOLD) {
              print("PRICE AND VOL! - SYM: %s P DIFF: %.8f DIFF: %.8f VOL: %.8f",stored_currency.symbol,priceDiff, volDiff, objCurrency.volume);          
            } else if (priceDiff > ONE_S_PRICE_DIFFERENCE_THRESHOLD && objCurrency.volume > MINIMUM_VOLUME_THRESHOLD) {
              print("PRICE! - SYM: %s P DIFF: %.8f DIFF: %.8f VOL: %.8f",stored_currency.symbol,priceDiff, volDiff, objCurrency.volume);          
            } else  if (volDiff > VOLUME_DIFFERENCE_THRESHOLD && objCurrency.volume > MINIMUM_VOLUME_THRESHOLD) {
              print("VOLUME! - SYM: %s P DIFF: %.8f DIFF: %.8f VOL: %.8f",stored_currency.symbol,priceDiff, volDiff, objCurrency.volume);
            }

            if (ct - stored_currency.ten_sec_time_stamp >= 10) {
              let ten_second_price_diff = ((objCurrency.bid_price - stored_currency.ten_sec_start_bid_price) / stored_currency.ten_sec_start_bid_price) * 100
              if (ten_second_price_diff > TEN_S_PRICE_DIFFERENCE_THRESHOLD) {
                print("PRICE AND VOL! - SYM: %s P DIFF: %.8f DIFF: %.8f VOL: %.8f",stored_currency.symbol,priceDiff, volDiff, objCurrency.volume);  
              }
              stored_currency.ten_sec_start_bid_price = objCurrency.bid_price
              stored_currency.ten_sec_time_stamp = ct
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


