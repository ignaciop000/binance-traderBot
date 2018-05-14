"use strict"

// binanceRequest is used to get an axios instance with default url and default header
let binanceRequest = require('./request');
const { format, checkEnum } = require('./utils');
const axios = require("axios");

class Binance {

	constructor(config = {}) {        
        this.api = this.checkKey(config.api) // check of the apikey format
        this.secret = this.checkKey(config.secret) // check of the secret key format
		this.request = binanceRequest(config);
	}
    
    checkKey(key) {
        if (key && typeof key === "string" && key.length === 64) {
            return key;
        } else if (key){
            throw new SyntaxError(["Bad key format", key].join(" "));
        } else {
            return null;
        }
    }

    checkParams(data, required){
        if (!data || typeof data !== "object") {
            throw new SyntaxError("data args is required and should be an object")
        }

        if (!required || !Array.isArray(required)) {
            throw new SyntaxError("required args is required and should be an array")
        }        

        // we iterate on the required params array
        required.map((req)=>{
            if (!data[req]) {// if the param is not provided in the data object provided to the function
                throw new SyntaxError(req+" parameters is required for this method") // we throw an error
            }
        })

        for (let key in data) {
            let value = data[key]

            switch (key){
                case 'symbol':
                case 'newClientOrderId':
                case 'origClientOrderId':
                case 'listenKey':
                    if (typeof value !== "string") {
                        throw new TypeError(key+" should be a string")
                    }
                    break;

                //check for the enum type
                case 'side':
                    checkEnum(["BUY", "SELL"], value, key)
                    break;
                case 'type':
                    checkEnum(["LIMIT", "MARKET"], value, key)
                    break;
                case 'timeInForce':
                    checkEnum(["GTC", "IOC"], value, key)
                    break;

                case 'quantity':
                case 'price':
                case 'stopPrice':
                case 'icebergQty':
                case 'recvWindow':
                case 'fromId':
                    if (typeof value !== "number") {
                        throw new TypeError(key+" should be a number")
                    }
                    break;
            }

        }
        return null
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

    async allOrders(params = {}){
        this.signedMethod() // secret and api key required for this method

        checkParams(params, ["symbol"]) // data required in the params object

        const url = "v3/allOrders"
        const { data } = await this.request.get(this.makeQuery(url, params).signedQuery())
        return data;
    }
    
    apiRequired(){
        if (!this.api)
            throw new SyntaxError("API key is required for this method")
    }

    signedMethod(){ //function word because we need to bind "this" context
        this.apiRequired()
        if (!this.secret)
            throw new SyntaxError("Secret key is required for this method")
    }


    makeQuery(link, dataQuery = {}) {
        this.signedMethod()

        return (function(url, data, secret, timeout){ // return a closure to have a "different" this in each instance of makeQuery()

            if (!url || typeof url !== "string")
                throw "Url is missing and should be a string"

            if (!data || typeof data !== "object")
                throw "Object type required for data param"

            if (data.timestamp)
                delete data.timestamp

            const query = Object.keys(data).map((key)=> {
                return key+"="+data[key]
            })

            this.signedQuery = ()=>{
                if (timeout)
                    query.push("recvWindow="+timeout)

                const now = process.env.NODE_ENV === "test" ? 1508279351690 : Date.now() // for unit testing we set a static timestamp
                const queryTimeStamp = [ query.join('&'), "&timestamp="+now ].join("")
                return [ url, "?", queryTimeStamp, "&signature="+getSignature(queryTimeStamp, secret) ].join("")
            }

            this.query = ()=>{
                return [ url, (query.length ? "?" : ""), query.join('&') ].join("")
            }

            return this
        }).call({}, link, dataQuery, this.secret, this.timeout) // bind an empty object as this
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