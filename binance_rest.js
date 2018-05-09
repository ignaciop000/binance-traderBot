// binanceRequest is used to get an axios instance with default url and default header
let binanceRequest = require('./request');
const axios = require("axios");

class Binance {
	constructor(config) {
		this.request = binanceRequest(config);
	}

	async get_ticker(symbol){			
    	const url = '/v1/ticker/24hr';
    	const { data } = await this.request.get(url, { params : { symbol: symbol }});
    	return data;
	}

	async get_order_book(symbol, limit = 50) {		
    	const url = '/v1/depth';
    	const { data } = await this.request.get(url, { params : { symbol: symbol, limit: limit} });
    	return data;    	
	}

	async get_exchange_info(symbol) {		
    	const url = '/v1/exchangeInfo';
    	const { data } = await this.request.get(url);
    	return data;
	}
}

module.exports = Binance;