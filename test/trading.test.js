"use strict"

const assert = require('assert')
const expect = require('chai').expect
const { checkEnum } = require('./../utils');
const { Trading } = require('./../trading');
const MockAdapter = require('axios-mock-adapter');
const Orders = require('./../orders');
const SocketMock = require('socket.io-mock');


describe('trading', function() {
	this.timeout(30000)

	describe('action', function() {	
		/*
    	it('BCNBTC - Real - Buy (FILLED) -> Sell', async function() {
    		let socket = new SocketMock();
    		socket.on('update', function (message) {    			
            	//console.log('onUpdate',message);
        	});
    		socket.on('orders', function (message) {
            	//console.log('onOrders',message);
        	});        	
    		let trading = new Trading(socket.socketClient, {
				symbol:'BCNBTC',
				quantity:0,
				stop_loss:0,
				mode:'profit',
				profit:1.0,
				increasing:0.00000001,
				decreasing:0.00000001,
				loop:0,
				wait_time:0.7,
				prints: 1,
			});
			let mockAdapter = new MockAdapter(trading.getClient().getClient().getRequest());
			mockAdapter.reset();
			mockAdapter.onGet('https://www.binance.com/api/v1/ticker/24hr', { params: {symbol:'BCNBTC'}}).reply(200, {"lastPrice":"0.00000130"});
			mockAdapter.onGet('https://www.binance.com/api/v1/exchangeInfo').reply(200, {"timezone":"UTC","serverTime":1526492176825,"rateLimits":[{"rateLimitType":"REQUESTS","interval":"MINUTE","limit":1200},{"rateLimitType":"ORDERS","interval":"SECOND","limit":10},{"rateLimitType":"ORDERS","interval":"DAY","limit":100000}],"exchangeFilters":[],"symbols":[{"symbol":"BCNBTC","status":"TRADING","baseAsset":"BCN","baseAssetPrecision":8,"quoteAsset":"BTC","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":false,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00000001","maxPrice":"100000.00000000","tickSize":"0.00000001"},{"filterType":"LOT_SIZE","minQty":"1.00000000","maxQty":"90000000.00000000","stepSize":"1.00000000"},{"filterType":"MIN_NOTIONAL","minNotional":"0.0009150"}]}]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8324887,"bids":[["0.00000128","5395047.00000000",[]]],"asks":[["0.00000130","8819526.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8324887,"bids":[["0.00000128","5395047.00000000",[]]],"asks":[["0.00000130","8819526.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8324887,"bids":[["0.00000130","5395047.00000000",[]]],"asks":[["0.00000131","8819526.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8324887,"bids":[["0.00000128","5395047.00000000",[]]],"asks":[["0.00000129","8819526.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8324887,"bids":[["0.00000128","5395047.00000000",[]]],"asks":[["0.00000129","8819526.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8324887,"bids":[["0.00000128","5395047.00000000",[]]],"asks":[["0.00000129","8819526.00000000",[]]]});
			mockAdapter.onPost(/v3\/order/).replyOnce(200, {orderId:123456});
			mockAdapter.onPost(/v3\/order/).replyOnce(200, {orderId:654321});
			mockAdapter.onGet(/api\/v3\/order/).replyOnce(200, {status:'FILLED', side:'BUY', price:0.00000129});
			mockAdapter.onGet(/api\/v3\/order/).replyOnce(200, {status:'FILLED', side:'BUY', price:0.00000129});
			mockAdapter.onGet(/api\/v3\/order/).replyOnce(200, {status:'FILLED', side:'BUY', price:0.00000131});
			//api/v3/order?symbol=ETHBTC&orderId=123456
			await trading.validate();
			await trading.action(trading.option.symbol);
			await trading.action(trading.option.symbol);
			await trading.action(trading.option.symbol);
    	});
    	*/
    	it('BCNBTC - Real - Cancel Order', async function() {
    		let socket = new SocketMock();
    		socket.on('update', function (message) {    			
            	//console.log('onUpdate',message);
        	});
    		socket.on('orders', function (message) {
            	//console.log('onOrders',message);
        	});        	
    		let trading = new Trading(socket.socketClient, {
				symbol:'BCNBTC',
				quantity:0,
				stop_loss:0,
				mode:'profit',
				profit:1.0,
				increasing:0.00000001,
				decreasing:0.00000001,
				loop:0,
				wait_time:0.7,
				prints: 1,
			});
			let mockAdapter = new MockAdapter(trading.getClient().getClient().getRequest());
			mockAdapter.reset();
			mockAdapter.onGet('https://www.binance.com/api/v1/ticker/24hr', { params: {symbol:'BCNBTC'}}).reply(200, {"lastPrice":"0.00000105"});
			mockAdapter.onGet('https://www.binance.com/api/v1/exchangeInfo').reply(200, {"timezone":"UTC","serverTime":1526492176825,"rateLimits":[{"rateLimitType":"REQUESTS","interval":"MINUTE","limit":1200},{"rateLimitType":"ORDERS","interval":"SECOND","limit":10},{"rateLimitType":"ORDERS","interval":"DAY","limit":100000}],"exchangeFilters":[],"symbols":[{"symbol":"BCNBTC","status":"TRADING","baseAsset":"BCN","baseAssetPrecision":8,"quoteAsset":"BTC","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":false,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00000001","maxPrice":"100000.00000000","tickSize":"0.00000001"},{"filterType":"LOT_SIZE","minQty":"1.00000000","maxQty":"90000000.00000000","stepSize":"1.00000000"},{"filterType":"MIN_NOTIONAL","minNotional":"0.0009150"}]}]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8536591,"bids":[["0.00000104","15801275.00000000",[]]],"asks":[["0.00000106","10402294.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8536591,"bids":[["0.00000104","15801275.00000000",[]]],"asks":[["0.00000106","10402294.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8536618,"bids":[["0.00000105","57371.00000000",[]]],"asks":[["0.00000106","10412143.00000000",[]]]});
			mockAdapter.onPost(/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","orderId":5569742,"transactTime":1526951032566,"price":"0.00000105","origQty":"1037.00000000","executedQty":"0.00000000","status":"NEW","timeInForce":"GTC","type":"LIMIT","side":"BUY"});
			mockAdapter.onGet(/api\/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","orderId":5569742,"price":"0.00000105","origQty":"1037.00000000","executedQty":"0.00000000","status":"NEW","timeInForce":"GTC","type":"LIMIT","side":"BUY","stopPrice":"0.00000000","icebergQty":"0.00000000","time":1526951032566,"isWorking":true});
			mockAdapter.onGet(/api\/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","orderId":5569742,"price":"0.00000105","origQty":"1037.00000000","executedQty":"0.00000000","status":"NEW","timeInForce":"GTC","type":"LIMIT","side":"BUY","stopPrice":"0.00000000","icebergQty":"0.00000000","time":1526951032566,"isWorking":true});			
			mockAdapter.onDelete(/api\/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","orderId":5569742,"clientOrderId":"PKCzdPbM9nj59wlT6bOIyb"});			
			await trading.validate();
			await trading.action(trading.option.symbol);
			await trading.action(trading.option.symbol);			
    	});    	
    	it('BCNBTC - Real - Buy Order and wait', async function() {
    		let socket = new SocketMock();
    		socket.on('update', function (message) {    			
            	//console.log('onUpdate',message);
        	});
    		socket.on('orders', function (message) {
            	//console.log('onOrders',message);
        	});        	
    		let trading = new Trading(socket.socketClient, {
				symbol:'BCNBTC',
				quantity:0,
				stop_loss:0,
				mode:'profit',
				profit:1.0,
				increasing:0.00000001,
				decreasing:0.00000001,
				loop:0,
				wait_time:0.7,
				prints: 1,
			});
			let mockAdapter = new MockAdapter(trading.getClient().getClient().getRequest());
			mockAdapter.reset();
			mockAdapter.onGet('https://www.binance.com/api/v1/ticker/24hr', { params: {symbol:'BCNBTC'}}).reply(200, {"lastPrice":"0.00000104"});
			mockAdapter.onGet('https://www.binance.com/api/v1/exchangeInfo').reply(200, {"timezone":"UTC","serverTime":1526492176825,"rateLimits":[{"rateLimitType":"REQUESTS","interval":"MINUTE","limit":1200},{"rateLimitType":"ORDERS","interval":"SECOND","limit":10},{"rateLimitType":"ORDERS","interval":"DAY","limit":100000}],"exchangeFilters":[],"symbols":[{"symbol":"BCNBTC","status":"TRADING","baseAsset":"BCN","baseAssetPrecision":8,"quoteAsset":"BTC","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":false,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00000001","maxPrice":"100000.00000000","tickSize":"0.00000001"},{"filterType":"LOT_SIZE","minQty":"1.00000000","maxQty":"90000000.00000000","stepSize":"1.00000000"},{"filterType":"MIN_NOTIONAL","minNotional":"0.0009150"}]}]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8556230,"bids":[["0.00000103","11262645.00000000",[]],["0.00000102","14315062.00000000",[]],["0.00000101","16115926.00000000",[]],["0.00000100","29154628.00000000",[]],["0.00000099","7830776.00000000",[]]],"asks":[["0.00000105","10912500.00000000",[]],["0.00000106","9010746.00000000",[]],["0.00000107","14129437.00000000",[]],["0.00000108","13130855.00000000",[]],["0.00000109","13408497.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8556230,"bids":[["0.00000103","11262645.00000000",[]],["0.00000102","14315062.00000000",[]],["0.00000101","16115926.00000000",[]],["0.00000100","29154628.00000000",[]],["0.00000099","7830776.00000000",[]]],"asks":[["0.00000105","10912500.00000000",[]],["0.00000106","9010746.00000000",[]],["0.00000107","14129437.00000000",[]],["0.00000108","13130855.00000000",[]],["0.00000109","13408497.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8556230,"bids":[["0.00000103","11262645.00000000",[]],["0.00000102","14315062.00000000",[]],["0.00000101","16115926.00000000",[]],["0.00000100","29154628.00000000",[]],["0.00000099","7830776.00000000",[]]],"asks":[["0.00000105","10912500.00000000",[]],["0.00000106","9010746.00000000",[]],["0.00000107","14129437.00000000",[]],["0.00000108","13130855.00000000",[]],["0.00000109","13408497.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8556230,"bids":[["0.00000103","11262645.00000000",[]],["0.00000102","14315062.00000000",[]],["0.00000101","16115926.00000000",[]],["0.00000100","29154628.00000000",[]],["0.00000099","7830776.00000000",[]]],"asks":[["0.00000105","10912500.00000000",[]],["0.00000106","9010746.00000000",[]],["0.00000107","14129437.00000000",[]],["0.00000108","13130855.00000000",[]],["0.00000109","13408497.00000000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'BCNBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":8556230,"bids":[["0.00000103","11262645.00000000",[]],["0.00000102","14315062.00000000",[]],["0.00000101","16115926.00000000",[]],["0.00000100","29154628.00000000",[]],["0.00000099","7830776.00000000",[]]],"asks":[["0.00000105","10912500.00000000",[]],["0.00000106","9010746.00000000",[]],["0.00000107","14129437.00000000",[]],["0.00000108","13130855.00000000",[]],["0.00000109","13408497.00000000",[]]]});
			mockAdapter.onPost(/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","orderId":5581947,"transactTime":1526955663404,"price":"0.00000104","origQty":"1037.00000000","executedQty":"0.00000000","status":"NEW","timeInForce":"GTC","type":"LIMIT","side":"BUY"});
			mockAdapter.onPost(/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","orderId":5581962,"price":"0.00000106","origQty":"1037.00000000","executedQty":"0.00000000","status":"NEW","timeInForce":"GTC","type":"LIMIT","side":"SELL","stopPrice":"0.00000000","icebergQty":"0.00000000","time":1526955665421,"isWorking":true});
			mockAdapter.onGet(/api\/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","orderId":5581947,"price":"0.00000104","origQty":"1037.00000000","executedQty":"1037.00000000","status":"FILLED","timeInForce":"GTC","type":"LIMIT","side":"BUY","stopPrice":"0.00000000","icebergQty":"0.00000000","time":1526955663404,"isWorking":true});
			mockAdapter.onGet(/api\/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","orderId":5581962,"price":"0.00000106","origQty":"1037.00000000","executedQty":"0.00000000","status":"NEW","timeInForce":"GTC","type":"LIMIT","side":"SELL","stopPrice":"0.00000000","icebergQty":"0.00000000","time":1526955665421,"isWorking":true});
			//mockAdapter.onGet(/api\/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","orderId":5581947,"clientOrderId":"YfySzzBHsi1GxhL1qsq3t7","price":"0.00000104","origQty":"1037.00000000","executedQty":"1037.00000000","status":"FILLED","timeInForce":"GTC","type":"LIMIT","side":"BUY","stopPrice":"0.00000000","icebergQty":"0.00000000","time":1526955663404,"isWorking":true});			
			//mockAdapter.onDelete(/api\/v3\/order/).replyOnce(200, {"symbol":"BCNBTC","origClientOrderId":"P9TXwOEIbILAxfA4EWqWjh","orderId":5569742,"clientOrderId":"PKCzdPbM9nj59wlT6bOIyb"});			
			await trading.validate();
			await trading.action(trading.option.symbol);
			await trading.action(trading.option.symbol);
			await trading.action(trading.option.symbol);		
    	});    	
    });
/*
	describe('action', function() {	
    	it('Buy (FILLED) -> Sell', async function() {
    		let socket = new SocketMock();
    		socket.on('update', function (message) {    			
            	//console.log('onUpdate',message);
        	});
    		socket.on('orders', function (message) {
            	console.log('onOrders',message);
        	});        	
    		let trading = new Trading(socket.socketClient, {
				symbol:'ETHBTC',
				quantity:0,
				stop_loss:0,
				mode:'profit',
				profit:1.0,
				increasing:0.00000001,
				decreasing:0.00000001,
				loop:0,
				wait_time:0.7,
				prints: 1,
			});
			let mockAdapter = new MockAdapter(trading.getClient().getClient().getRequest());
			mockAdapter.reset();
			mockAdapter.onGet('https://www.binance.com/api/v1/ticker/24hr', { params: {symbol:'ETHBTC'}}).reply(200, {"symbol":"ETHBTC","priceChange":"-0.00050700","priceChangePercent":"-0.599","weightedAvgPrice":"0.08372700","prevClosePrice":"0.08461600","lastPrice":"0.08419200","lastQty":"0.03200000","bidPrice":"0.08410000","bidQty":"0.95000000","askPrice":"0.08412000","askQty":"0.03300000","openPrice":"0.08469900","highPrice":"0.08475500","lowPrice":"0.08240900","volume":"119159.69000000","quoteVolume":"9976.88282598","openTime":1526404122790,"closeTime":1526490522790,"firstId":62789183,"lastId":63050807,"count":261625});
			mockAdapter.onGet('https://www.binance.com/api/v1/exchangeInfo').reply(200, {"timezone":"UTC","serverTime":1526492176825,"rateLimits":[{"rateLimitType":"REQUESTS","interval":"MINUTE","limit":1200},{"rateLimitType":"ORDERS","interval":"SECOND","limit":10},{"rateLimitType":"ORDERS","interval":"DAY","limit":100000}],"exchangeFilters":[],"symbols":[{"symbol":"ETHBTC","status":"TRADING","baseAsset":"ETH","baseAssetPrecision":8,"quoteAsset":"BTC","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":false,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00000100","maxPrice":"100000.00000000","tickSize":"0.00000100"},{"filterType":"LOT_SIZE","minQty":"0.00100000","maxQty":"100000.00000000","stepSize":"0.00100000"},{"filterType":"MIN_NOTIONAL","minNotional":"0.00100000"}]},{"symbol":"LTCBTC","status":"TRADING","baseAsset":"LTC","baseAssetPrecision":8,"quoteAsset":"BTC","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":false,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00000100","maxPrice":"100000.00000000","tickSize":"0.00000100"},{"filterType":"LOT_SIZE","minQty":"0.01000000","maxQty":"100000.00000000","stepSize":"0.01000000"},{"filterType":"MIN_NOTIONAL","minNotional":"0.00100000"}]}]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":226676850,"bids":[["0.08378800","1.77900000",[]],["0.08378700","6.26600000",[]]],"asks":[["0.08386400","7.00900000",[]],["0.08386800","0.01700000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":226676850,"bids":[["0.05378800","1.77900000",[]],["0.08378700","6.26600000",[]]],"asks":[["0.08386400","7.00900000",[]],["0.08386800","0.01700000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":226676850,"bids":[["0.05378800","1.77900000",[]],["0.08378700","6.26600000",[]]],"asks":[["0.08386400","7.00900000",[]],["0.08386800","0.01700000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":226676850,"bids":[["0.05378800","1.77900000",[]],["0.08378700","6.26600000",[]]],"asks":[["0.08386400","7.00900000",[]],["0.08386800","0.01700000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":226676850,"bids":[["0.05378800","1.77900000",[]],["0.08378700","6.26600000",[]]],"asks":[["0.08386400","7.00900000",[]],["0.08386800","0.01700000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":226676850,"bids":[["0.05378800","1.77900000",[]],["0.08378700","6.26600000",[]]],"asks":[["0.08386400","7.00900000",[]],["0.08386800","0.01700000",[]]]});
			mockAdapter.onPost(/v3\/order/).replyOnce(200, {orderId:123456});
			mockAdapter.onPost(/v3\/order/).replyOnce(200, {orderId:654321});
			mockAdapter.onGet(/api\/v3\/order/).reply(200, {status:'FILLED', side:'BUY', price:0.05378900});
			//api/v3/order?symbol=ETHBTC&orderId=123456
			await trading.validate();
			await trading.action(trading.option.symbol);
			await trading.action(trading.option.symbol);
			await trading.action(trading.option.symbol);
    	});
    });

    describe('buy', function() {	
    	it('buy - scene1', async function() {
    		let socket = new SocketMock();
    		socket.on('update', function (message) {    			
            	console.log('onUpdate',message);
        	});
    		socket.on('orders', function (message) {
            	console.log('onOrders',message);
        	});        	
    		let trading = new Trading(socket.socketClient, {
				symbol:'ETHBTC',
				quantity:0,
				stop_loss:0,
				mode:'profit',
				profit:1.0,
				increasing:0.00000001,
				decreasing:0.00000001,
				loop:0,
				wait_time:0.7,
				prints: 1,
			});
			let mockAdapter = new MockAdapter(trading.getClient().getClient().getRequest());
			mockAdapter.reset();
			mockAdapter.onPost(/v3\/order/).reply(200, {orderId:123456});
			//await trading.validate();
			//await trading.action(trading.option.symbol);
			await trading.buy('ETHBTC', 0.001, 0.0087, 0.0090)
    	});
    });

	describe('Validate', function() {	
    	it('Validate - should be ok', async function() {
    		let trading = new Trading(null, {
				symbol:'ETHBTC',
				quantity:0,
				stop_loss:0,
				mode:'profit',
				profit:1.0,
				increasing:0.00000001,
				decreasing:0.00000001,
				loop:0,
				wait_time:0.7,
				prints: 1,
			});
    		let mockAdapter = new MockAdapter(trading.getClient().getClient().getRequest());
    		mockAdapter.reset();
			mockAdapter.onGet('https://www.binance.com/api/v1/ticker/24hr', { params: {symbol:'ETHBTC'}}).reply(200, {"symbol":"ETHBTC","priceChange":"-0.00050700","priceChangePercent":"-0.599","weightedAvgPrice":"0.08372700","prevClosePrice":"0.08461600","lastPrice":"0.08419200","lastQty":"0.03200000","bidPrice":"0.08410000","bidQty":"0.95000000","askPrice":"0.08412000","askQty":"0.03300000","openPrice":"0.08469900","highPrice":"0.08475500","lowPrice":"0.08240900","volume":"119159.69000000","quoteVolume":"9976.88282598","openTime":1526404122790,"closeTime":1526490522790,"firstId":62789183,"lastId":63050807,"count":261625});   		
      		mockAdapter.onGet('https://www.binance.com/api/v1/exchangeInfo').reply(200, {"timezone":"UTC","serverTime":1526492176825,"rateLimits":[{"rateLimitType":"REQUESTS","interval":"MINUTE","limit":1200},{"rateLimitType":"ORDERS","interval":"SECOND","limit":10},{"rateLimitType":"ORDERS","interval":"DAY","limit":100000}],"exchangeFilters":[],"symbols":[{"symbol":"ETHBTC","status":"TRADING","baseAsset":"ETH","baseAssetPrecision":8,"quoteAsset":"BTC","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":false,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00000100","maxPrice":"100000.00000000","tickSize":"0.00000100"},{"filterType":"LOT_SIZE","minQty":"0.00100000","maxQty":"100000.00000000","stepSize":"0.00100000"},{"filterType":"MIN_NOTIONAL","minNotional":"0.00100000"}]},{"symbol":"LTCBTC","status":"TRADING","baseAsset":"LTC","baseAssetPrecision":8,"quoteAsset":"BTC","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":false,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00000100","maxPrice":"100000.00000000","tickSize":"0.00000100"},{"filterType":"LOT_SIZE","minQty":"0.01000000","maxQty":"100000.00000000","stepSize":"0.01000000"},{"filterType":"MIN_NOTIONAL","minNotional":"0.00100000"}]}]});
      		mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).reply(200, {"lastUpdateId":226676850,"bids":[["0.08378800","1.77900000",[]],["0.08378700","6.26600000",[]]],"asks":[["0.08386400","7.00900000",[]],["0.08386800","0.01700000",[]]]});
    		await trading.validate();
    		expect(trading.option.symbol).to.be.equal('ETHBTC');
    		expect(trading.quantity).to.be.equal(0.013000000000000001);
    		expect(trading.stop_loss).to.be.equal(0);
    		expect(trading.increasing).to.be.equal(0.000001);
    		expect(trading.decreasing).to.be.equal(0.000001);
    		expect(trading.step_size).to.be.equal(0.001);    	
      	})      	
    })
    */

})