const api = require('./binanceapi');
const { Binance } = api // rest api
const { BinanceWS } = api // websocket api
 
const conf = {
	api: "",
    secret: ""
}

const client = new Binance(conf);

async function get_ticker(symbol) { 
	try {	
		let response = await client.get_ticker(symbol);
		//console.log(response);	
		return response.lastPrice;
	} catch (err) {
		console.log(err);
	}
}

async function get_order_book(symbol) {
	try {
		let response = await client.get_order_book(symbol, 5);
		//console.log(response);
		let lastBid = parseFloat(response.bids[0][0]) //last buy price (bid)
	    let lastAsk = parseFloat(response.asks[0][0]) //last sell price (ask)
	 	return {lastAsk:lastAsk, lastBid:lastBid};
 	} catch (err) {
 		console.log(err);
 		return {lastAsk:0, lastBid:0}; 
 	}
}

async function get_info(symbol) {
    try {
    	let response = await client.get_exchange_info();
        //console.log(response);
        if (symbol != "") {
        	for(let item of response.symbols) {
        		if (item.symbol == symbol) {
        			return item;
        		}
        	}
        } 
        return response
            
 	} catch (err) {
 		console.log(err);
 	}
}

module.exports.get_ticker = get_ticker;
module.exports.get_order_book = get_order_book;
module.exports.get_info = get_info;

