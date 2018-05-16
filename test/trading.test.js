"use strict"

const assert = require('assert')
const expect = require('chai').expect
const { checkEnum } = require('./../utils');
const { Trading } = require('./../trading');
const MockAdapter = require('axios-mock-adapter');
const Orders = require('./../orders');
const SocketMock = require('socket.io-mock');


describe('trading', function() {

	describe('action', function() {	
    	it('Action - scene1', async function() {
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
			mockAdapter.onGet('https://www.binance.com/api/v1/ticker/24hr', { params: {symbol:'ETHBTC'}}).reply(200, {"symbol":"ETHBTC","priceChange":"-0.00050700","priceChangePercent":"-0.599","weightedAvgPrice":"0.08372700","prevClosePrice":"0.08461600","lastPrice":"0.08419200","lastQty":"0.03200000","bidPrice":"0.08410000","bidQty":"0.95000000","askPrice":"0.08412000","askQty":"0.03300000","openPrice":"0.08469900","highPrice":"0.08475500","lowPrice":"0.08240900","volume":"119159.69000000","quoteVolume":"9976.88282598","openTime":1526404122790,"closeTime":1526490522790,"firstId":62789183,"lastId":63050807,"count":261625});
			mockAdapter.onGet('https://www.binance.com/api/v1/exchangeInfo').reply(200, {"timezone":"UTC","serverTime":1526492176825,"rateLimits":[{"rateLimitType":"REQUESTS","interval":"MINUTE","limit":1200},{"rateLimitType":"ORDERS","interval":"SECOND","limit":10},{"rateLimitType":"ORDERS","interval":"DAY","limit":100000}],"exchangeFilters":[],"symbols":[{"symbol":"ETHBTC","status":"TRADING","baseAsset":"ETH","baseAssetPrecision":8,"quoteAsset":"BTC","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":false,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00000100","maxPrice":"100000.00000000","tickSize":"0.00000100"},{"filterType":"LOT_SIZE","minQty":"0.00100000","maxQty":"100000.00000000","stepSize":"0.00100000"},{"filterType":"MIN_NOTIONAL","minNotional":"0.00100000"}]},{"symbol":"LTCBTC","status":"TRADING","baseAsset":"LTC","baseAssetPrecision":8,"quoteAsset":"BTC","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":false,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00000100","maxPrice":"100000.00000000","tickSize":"0.00000100"},{"filterType":"LOT_SIZE","minQty":"0.01000000","maxQty":"100000.00000000","stepSize":"0.01000000"},{"filterType":"MIN_NOTIONAL","minNotional":"0.00100000"}]}]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":226676850,"bids":[["0.08378800","1.77900000",[]],["0.08378700","6.26600000",[]]],"asks":[["0.08386400","7.00900000",[]],["0.08386800","0.01700000",[]]]});
			mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).replyOnce(200, {"lastUpdateId":226676850,"bids":[["0.05378800","1.77900000",[]],["0.08378700","6.26600000",[]]],"asks":[["0.08386400","7.00900000",[]],["0.08386800","0.01700000",[]]]});
			await trading.validate();
			await trading.action(trading.option.symbol);
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

})