"use strict"

const assert = require('assert');
const expect = require('chai').expect
const binanceRequest = require('../request');

describe('binanceRequest', function() {

      it('Call without param - should be ok', function() {
        const req = binanceRequest()
        expect(req.defaults.headers["X-MBX-APIKEY"]).to.be.undefined
        expect(req.defaults.baseURL).to.be.equal("https://www.binance.com/api")
        expect(req.defaults.timeout).to.be.equal(0)
      })

      it('Call with api param - should be ok', function() {
        const req = binanceRequest({api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A"})
        expect(req.defaults.headers["X-MBX-APIKEY"]).to.be.equal("vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A")
        expect(req.defaults.baseURL).to.be.equal("https://www.binance.com/api")
        expect(req.defaults.timeout).to.be.equal(0)
      })

      it('Call with api and timeout param - should be ok', function() {
        const req = binanceRequest({api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A", timeout: 10000})
        expect(req.defaults.headers["X-MBX-APIKEY"]).to.be.equal("vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A")
        expect(req.defaults.baseURL).to.be.equal("https://www.binance.com/api")
        expect(req.defaults.timeout).to.be.equal(10000)
      })

  })