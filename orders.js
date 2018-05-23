const api = require('./binanceapi');
const { Binance } = api // rest api
const { BinanceWS } = api // websocket api
const { print } = require('./utils');
let env = '';
if (process.env.NODE_ENV) {
	env = '.'+process.env.NODE_ENV;
}
const config = require('./config'+env);
 
const conf = {
	api: config.api,
    secret: config.secret
}

const client = new Binance(conf);

function getClient() {
	return client;
}

async function get_ticker(symbol) { 
	try {	
		let response = await client.get_ticker(symbol);
		//console.log(response);	
		return response.lastPrice;
	} catch (err) {
		//console.log(err);
		throw new Error('Invalid get_ticker'); 
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
 		print('Invalid Order Book');
 		throw new Error('Invalid Order Book'); 		
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
 		return null;
 	}
}

async function buy_limit(symbol, quantity, buyPrice) {
	let order = await client.buy_limit(symbol, quantity, buyPrice)
	if (order.msg) {
		print("%s",order.msg);
		process.exit(1);
	}
    // Buy order created.
    if (!order.orderId) {
    	print("Buy order without orderId");
    	process.exit(1);	
    }
    return order.orderId;
}

async function get_order(symbol, orderId) {
    try {
        let order = await client.query_order(symbol, orderId)
		
		if (order.msg) {
			print("%s",order.msg);
			process.exit(1);
		}

        return order
    } catch (err) {
        print('get_order Exception: %s' , err);
        throw new Error('Invalid get_order'); 
    }
}

async function cancel_order(symbol, orderId) {
        try{
            
            let order = await client.cancel(symbol, orderId)

			if (order.msg) {
				print("%s",order.msg);
				process.exit(1);
			}
            
            print('Profit loss, called order, %s' , orderId)
        
            return true
        
        } catch (err) {
            print('cancel_order Exception: %s' , err)
            throw new Error('Invalid cancel_order'); 
        }
}

async function sell_limit(symbol, quantity, sell_price){

       let order = await client.sell_limit(symbol, quantity, sell_price)  

		if (order.msg) {
			print("%s",order.msg);
			process.exit(1);
		}

        return order
}

async function sell_market(symbol, quantity, sell_price){

       let order = await client.sell_market(symbol, quantity, sell_price)  

		if (order.msg) {
			print("%s",order.msg);
			process.exit(1);
		}

        return order
}

async function openOrders () {
	try {
		let orders = await client.openOrders();

		return orders;
	} catch (err) {
		print('openOrders Exception: %s', err);
		return []; 
	}
}

async function get_products () {
	try {
		let coins = await client.get_products();
		return coins;
	} catch (err) {
		print('get_products Exception: %s', err);
		return []; 
	}
}

async function get_account() {
	try {
		let account = await client.get_account();
		return account;
	} catch (err) {
		print('get_account Exception: %s', err);
		return null; 
	}
}

module.exports.get_ticker = get_ticker;
module.exports.get_order_book = get_order_book;
module.exports.get_info = get_info;
module.exports.buy_limit = buy_limit;
module.exports.get_order = get_order;
module.exports.cancel_order = cancel_order;
module.exports.sell_limit = sell_limit;
module.exports.openOrders = openOrders;
module.exports.get_products = get_products;
module.exports.get_account = get_account;
module.exports.getClient = getClient;