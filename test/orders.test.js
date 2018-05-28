"use strict"

const assert = require('assert')
const expect = require('chai').expect
const { checkEnum } = require('./../utils');
const MockAdapter = require('axios-mock-adapter');
const Orders = require('./../orders');


describe('Orders', function() {

  describe('get_ticker', function() {
    this.timeout(10000)
    it('get_ticker - should be ok', function(done) {
      let mockAdapter = new MockAdapter(Orders.getClient().getRequest());
      mockAdapter.onGet('https://www.binance.com/api/v1/ticker/24hr', { params: {symbol:'ETHBTC'}}).reply(404, {
          msg:'error 404'
      });
      Orders.get_ticker('ETHBTC').then((lastPrice) => {              
        done(new Error('Catch'));
      }).catch((err) => {                      
        done()
      });
    });
  });

  describe('get_ticker', function() {
    this.timeout(10000)
    it('get_ticker - should be ok', function(done) {
      let mockAdapter = new MockAdapter(Orders.getClient().getRequest());
		  mockAdapter.onGet('https://www.binance.com/api/v1/ticker/24hr', { params: {symbol:'ETHBTC'}}).reply(200, {
          symbol: 'ETHBTC',
          priceChange: '-0.00050700',
          priceChangePercent: '-0.599',
          weightedAvgPrice: '0.08372700',
          prevClosePrice: '0.08461600',
          lastPrice: '0.08419200',
          lastQty: '0.03200000',
          bidPrice: '0.08410000',
          bidQty: '0.95000000',
          askPrice: '0.08412000',
          askQty: '0.03300000',
          openPrice: '0.08469900',
          highPrice: '0.08475500',
          lowPrice: '0.08240900',
          volume: '119159.69000000',
          quoteVolume: '9976.88282598',
          openTime: 1526404122790,
          closeTime: 1526490522790,
          firstId: 62789183,
          lastId: 63050807,
          count: 261625 
     	});
      Orders.get_ticker('ETHBTC').then((lastPrice) => {      
        expect(lastPrice).to.be.equal('0.08419200')        
        done()
      }).catch((err) => {                      
        done(new Error('Catch'));
      });
    });
  });

  describe('get_order_book', function() {
    this.timeout(10000)
    it('get_order_book - should be ok', function(done) {
      let mockAdapter = new MockAdapter(Orders.getClient().getRequest());
      mockAdapter.onGet('https://www.binance.com/api/v1/depth', { params: { symbol: 'ETHBTC', limit: 5 }}).reply(200, {
        "lastUpdateId": 226676850,
        "bids": [
          [
            "0.08378800",
            "1.77900000",
            []
          ],
          [
            "0.08378700",
            "6.26600000",
            []
          ]
        ],
        "asks": [
          [
            "0.08386400",
            "7.00900000",
            []
          ],
          [
            "0.08386800",
            "0.01700000",
            []
          ]
        ]
      });
      Orders.get_order_book('ETHBTC').then((last) => {      
        expect(last.lastAsk).to.be.equal(0.083864);
        expect(last.lastBid).to.be.equal(0.083788);
        done()
      }).catch((err) => {                      
        done(new Error('Catch'));
      });
    });
  });


  describe('get_info', function() {
    this.timeout(10000)
    it('get_info - should be ok', function(done) {
      let mockAdapter = new MockAdapter(Orders.getClient().getRequest());
      mockAdapter.onGet('https://www.binance.com/api/v1/exchangeInfo').reply(200, {
  "timezone": "UTC",
  "serverTime": 1526492176825,
  "rateLimits": [
    {
      "rateLimitType": "REQUESTS",
      "interval": "MINUTE",
      "limit": 1200
    },
    {
      "rateLimitType": "ORDERS",
      "interval": "SECOND",
      "limit": 10
    },
    {
      "rateLimitType": "ORDERS",
      "interval": "DAY",
      "limit": 100000
    }
  ],
  "exchangeFilters": [],
  "symbols": [
    {
      "symbol": "ETHBTC",
      "status": "TRADING",
      "baseAsset": "ETH",
      "baseAssetPrecision": 8,
      "quoteAsset": "BTC",
      "quotePrecision": 8,
      "orderTypes": [
        "LIMIT",
        "LIMIT_MAKER",
        "MARKET",
        "STOP_LOSS_LIMIT",
        "TAKE_PROFIT_LIMIT"
      ],
      "icebergAllowed": false,
      "filters": [
        {
          "filterType": "PRICE_FILTER",
          "minPrice": "0.00000100",
          "maxPrice": "100000.00000000",
          "tickSize": "0.00000100"
        },
        {
          "filterType": "LOT_SIZE",
          "minQty": "0.00100000",
          "maxQty": "100000.00000000",
          "stepSize": "0.00100000"
        },
        {
          "filterType": "MIN_NOTIONAL",
          "minNotional": "0.00100000"
        }
      ]
    },
    {
      "symbol": "LTCBTC",
      "status": "TRADING",
      "baseAsset": "LTC",
      "baseAssetPrecision": 8,
      "quoteAsset": "BTC",
      "quotePrecision": 8,
      "orderTypes": [
        "LIMIT",
        "LIMIT_MAKER",
        "MARKET",
        "STOP_LOSS_LIMIT",
        "TAKE_PROFIT_LIMIT"
      ],
      "icebergAllowed": false,
      "filters": [
        {
          "filterType": "PRICE_FILTER",
          "minPrice": "0.00000100",
          "maxPrice": "100000.00000000",
          "tickSize": "0.00000100"
        },
        {
          "filterType": "LOT_SIZE",
          "minQty": "0.01000000",
          "maxQty": "100000.00000000",
          "stepSize": "0.01000000"
        },
        {
          "filterType": "MIN_NOTIONAL",
          "minNotional": "0.00100000"
        }
      ]
    }
  ]
      });
      Orders.get_info('ETHBTC').then((last) => {      
      //TODO   
        done()
      }).catch((err) => {                      
        done(new Error('Catch'));
      });
    });
  });
})