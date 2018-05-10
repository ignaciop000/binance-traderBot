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

	async buy_limit(market, quantity, rate){
		//TODO
		//path = "%s/order" % self.BASE_URL_V3
        //params = self._order(market, quantity, "BUY", rate)
        //return self._post(path, params)
        let data = {orderId:1000}
        return data;
	}

	async query_order(symbol, orderId){
		//TODO
        let data = {status:'FILLED', side:'BUY'}
        return data;
        //path = "%s/order" % self.BASE_URL_V3
        //params = {"symbol": market, "orderId": orderId}
        //return self._get(path, params)
	}

	async cancel(market, order_id){
    	//TODO
        let data = {}
        return data;
        //path = "%s/order" % self.BASE_URL_V3
        //params = {"symbol": market, "orderId": order_id}
        //return self._delete(path, params)
    }

    async sell_limit(market, quantity, rate){
        //path = "%s/order" % self.BASE_URL_V3
        //params = self._order(market, quantity, "SELL", rate)
        //return self._post(path, params)
        let data = {orderId:1001, status:'FILLED', price:'0.1'}
        return data;
    }
}

module.exports = Binance;