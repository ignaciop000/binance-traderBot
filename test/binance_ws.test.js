"use strict"

const assert = require('assert');
const expect = require('chai').expect;
const { BinanceWS } = require('../binanceapi')

describe('Binance Websocket', function() {

    it('Call without param - should throw an exception', function() {
      expect( function(){  new BinanceWS().initSocket() }).to.throw("path is required and should be a string")
    })

    it('Call without callback - should throw an exception', function() {
      expect( function(){  new BinanceWS().initSocket("test") }).to.throw("callback is required and should be a function")
    })

    it('Call with path and callback - should be ok', function() {
      const binancews = new BinanceWS();
      const ws = binancews.initSocket( "gasbtc@depth" , function(){})
      expect(binancews.getSockets()).to.have.property('gasbtc@depth')
      expect(binancews.getSockets()["gasbtc@depth"].url).to.equal("wss://stream.binance.com:9443/ws/gasbtc@depth")
      binancews.close();
    })

})