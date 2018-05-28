"use strict"

// binanceRequest is used to get an axios instance with default url and default header
let binanceRequest = require('./request');
const { format, checkEnum, print } = require('./utils');
const axios = require("axios");
const getSignature = require('./signature');
const fs = require('fs');
const debug = true;

class Binance {

	constructor(config = {}) {        
        this.api = this.checkKey(config.api) // check of the apikey format
        this.secret = this.checkKey(config.secret) // check of the secret key format
		this.request = binanceRequest(config);
	}

    getRequest() {
        return this.request;
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
                    //TODO validate float as string
                    break;
                case 'orderId':
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

	async get_ticker(symbol) {			        
        try {
            const url = 'api/v1/ticker/24hr';
            const { data } = await this.request.get(url, { params : { symbol: symbol }});
            return data;
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }
	}

	async get_order_book(symbol, limit = 50) {		    	
        try {
            const url = 'api/v1/depth';
    	    const { data } = await this.request.get(url, { params : { symbol: symbol, limit: limit} });
    	    return data;    	
        } catch (err) {
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }
	}

	async get_exchange_info(symbol) {		
    	try {
           const url = 'api/v1/exchangeInfo';        
    	   const { data } = await this.request.get(url);
           return data;
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }    	
	}

	async buy_limit(market, quantity, rate){		
        try {
            let params = {}       
            params.symbol = market;
            params.side = "BUY";
            params.type = "LIMIT";
            params.timeInForce = "GTC"
            params.quantity = format(quantity)
            params.price = format(rate)        
            this.signedMethod() // secret and api key required for this method
            this.checkParams(params, ["symbol", "side", "type", "timeInForce", "quantity", "price"]) // data required in the params object

            const url = "api/v3/order"
            let query = this.makeQuery(url, params);
            //console.log(query);
            const resp = await this.request.post(query);   
            return resp.data;
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }   
	}

	async query_order(symbol, orderId){
        try {
            this.signedMethod() // secret and api key required for this method
            let params = {}
            params.symbol = symbol;
            params.orderId = orderId;
            this.checkParams(params, ["symbol", "orderId"]) // data required in the params object

            const url = 'api/v3/order';
            let query = this.makeQuery(url, params);
            //console.log(query);
            const resp = await this.request.get(query);
            return resp.data; 
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }
        
	}

    async allOrders(params = {}){
        try {
            this.signedMethod() // secret and api key required for this method
            this.checkParams(params, ["symbol"]) // data required in the params object
            const url = "api/v3/allOrders"
            let query = this.makeQuery(url, params);
            const resp = await this.request.get(query);              
            return resp.data;
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }
    }

    async openOrders(params = {}){
        try {
            this.signedMethod() // secret and api key required for this method
            const url = "api/v3/openOrders"
            let query = this.makeQuery(url, params);
            const resp = await this.request.get(query);              
            return resp.data;
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }            
    }
    
    apiRequired(){
        if (!this.api) {
            throw new SyntaxError("API key is required for this method")
        }
    }
    
    signedMethod(){ //function word because we need to bind "this" context
        this.apiRequired()
        if (!this.secret) {
            throw new SyntaxError("Secret key is required for this method")
        }
    }


    makeQuery(url, dataQuery = {}, timestamp = -1) {
        this.signedMethod()
        
        if (!url || typeof url !== "string") {
            throw "Url is missing and should be a string"
        }
        
        if (!dataQuery || typeof dataQuery !== "object") {
            throw "Object type required for data param"
        }

        if (dataQuery.timestamp) {
            delete dataQuery.timestamp
        }

        if (this.timeout)
            dataQuery.recvWindow=timeout;
        
        const query = Object.keys(dataQuery).map((key)=> {
            return key+"="+dataQuery[key]
        })

        let now = Date.now() // for unit testing we set a static timestamp
        if (timestamp != -1) {
            now = timestamp
        }
        const queryTimeStamp = [ query.join('&'), "&timestamp="+now ].join("")
        return [ url, "?", queryTimeStamp, "&signature="+getSignature(queryTimeStamp, this.secret) ].join("")            
    }


	async cancel(market, order_id){
        try {
            this.signedMethod() // secret and api key required for this method
            let params = {}
            params.symbol = market;
            params.orderId = order_id;
            this.checkParams(params, ["symbol", "orderId"]) // data required in the params object

            const url = 'api/v3/order';
            let query = this.makeQuery(url, params);
            const resp = await this.request.delete(query); 
            return resp.data;
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }      
    }

    async sell_limit(market, quantity, rate){
        try {
            let params = {}
            params.symbol = market;
            params.side = "SELL";
            params.type = "LIMIT";
            params.timeInForce = "GTC"
            params.quantity = format(quantity)
            params.price = format(rate)        
            this.signedMethod() // secret and api key required for this method
            this.checkParams(params, ["symbol", "side", "type", "timeInForce", "quantity", "price"]) // data required in the params object

            const url = "api/v3/order"
            let query = this.makeQuery(url, params);
            //console.log(query);
            const resp = await this.request.post(query);    
            return resp.data;
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }                
    }

    async sell_market(market, quantity){
        try {
            let params = {}
            params.symbol = market;
            params.side = "SELL";
            params.type = "MARKET";
            params.quantity = format(quantity) 
            this.signedMethod() // secret and api key required for this method
            this.checkParams(params, ["symbol", "side", "type", "timeInForce", "quantity"]) // data required in the params object

            const url = "api/v3/order"
            let query = this.makeQuery(url, params);
            console.log(query);
            const resp = await this.request.post(query);    
            return resp.data; 
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }              
    }

    async get_products() {
        try {
            const url = "exchange/public/product"
            const { data } = await this.request.get(url);
            return data;
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }                  
    }

    async get_account() {
        try {
            let params = {};
            this.signedMethod() // secret and api key required for this method       
            const url = "api/v3/account"
            let query = this.makeQuery(url, params);
            const resp = await this.request.get(query);              
            return resp.data;
        } catch (err){
            if (debug) {
                console.log(err);
            }
            if (err && err.response && err.response.data && err.response.data.msg){
                print("Error Message: %s", err.response.data.msg);
            }
            throw err;
        }          
    }

}

module.exports = Binance;