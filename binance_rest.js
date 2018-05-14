// binanceRequest is used to get an axios instance with default url and default header
let binanceRequest = require('./request');
const { format } = require('./utils');
const axios = require("axios");

class Binance {

	constructor(config) {
		this.request = binanceRequest(config);
        this.orderId = 1000;
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

	async buy_limit(market, quantity, rate){		
        const url = '/v3/order';
        let params = this.makeOrder(market, quantity, "BUY", rate)
        const {data} = await this.request.post(url, params);
        return data;
	}

	async query_order(symbol, orderId){
        const url = '/v3/order';
        const { data } = await this.request.get(url, { params : { symbol: symbol, orderId: orderId} });
        return data;    
	}

	async cancel(market, order_id){
        const url = '/v3/order';
        const { data } = await this.request.delete(url, { params : { symbol: symbol, orderId: orderId} });
        return data; 
    }

    async sell_limit(market, quantity, rate){
        const url = '/v3/order';
        let params = this.makeOrder(market, quantity, "SELL", rate)
        const {data} = await this.request.post(url, params);
        return data;        
    }

    makeOrder(market, quantity, side, rate=null){
        params = {}
         
        if (rate != null) {
            params.type = "LIMIT"
            paramsprice = format(rate)
            params.timeInForce = "GTC"
        } else {
            params.type = "MARKET"
        }

        params.symbol = market
        params.side = side
        params.quantity = format(quantity)
        
        return params
    }
}

module.exports = Binance;