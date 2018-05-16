"use strict"

const assert = require('assert')
const expect = require('chai').expect
const { Binance } = require('../binanceapi')
const getSignature = require('../signature')
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

describe('Binance REST', function() {
  describe('checkKey', function() {

      it('Call without param - should return null', function() {        
        const val = new Binance().checkKey();
        expect(val).to.be.null
      })

      it('Call with wrong params - should throw an exception', function() {
        expect( function(){  new Binance().checkKey("54654") }).to.throw("Bad key format 54654")
      })

      it('Call with good params - should be ok', function() {
        const val = new Binance().checkKey("vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A")
        expect(val).to.be.equal("vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A")
      })

  })

    describe('checkParams', function() {

      it('Call without param - should throw an exception', function() {
        expect( function(){  new Binance().checkParams() }).to.throw("data args is required and should be an object")
      })

      it('Call with wrong type param - should throw an exception', function() {
        expect( function(){  new Binance().checkParams("first param should be an object") }).to.throw("data args is required and should be an object")
        expect( function(){  new Binance().checkParams({}, "second params should be an object") }).to.throw("required args is required and should be an array")
      })

      it('Call with good param but an required param is missing - should throw an exception', function() {
        expect( function(){  new Binance().checkParams({test: "keyTest"}, ["api"]) }).to.throw("api parameters is required for this method")
      })

      it('Call with good param - should be ok', function() {
        const val = new Binance().checkParams({api: "keyTest"}, ["api"])
        expect(val).to.be.null
      })
    })

    describe('Constructor', function() {

      it('Call without api key - no api and secret key, no default header', function() {
        const instance = new Binance()
        expect(instance.api).to.be.null
        expect(instance.secret).to.be.null
        expect(instance.request.defaults.headers["X-MBX-APIKEY"]).to.be.undefined
      })

      it('Call api key - api and secret key, default header', function() {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        expect(instance.api).to.be.equal("vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A")
        expect(instance.secret).to.be.equal("NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j")
        expect(instance.request.defaults.headers["X-MBX-APIKEY"]).to.be.equal("vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A")
      })

    })


/*
    describe('\n apiRequired', function() {
      this.timeout(10000)
      it('Call method without api key - should throw an exception', function() {
        const instance = new Binance()
        expect( function(){  instance.userDataStream() }).to.throw("API key is required for this method")
      })


      it('Call method with api key - should be ok', function(done) {
        const instance = new Binance({api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A"})
        instance.userDataStream()
          .then(done)
          .catch(done.bind({}, null)) // the response is not important here, only the good execution of the function is matter
      })

    })

*/
    describe('\n signedMethod', function() {
      this.timeout(10000)
      it('Call method without secret key - should throw an exception', function(done) {

        const instance = new Binance({api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A"})
        instance.allOrders().then(() => {
          done(new Error('Expected method to reject.'))
        }).catch((err) => {          
          expect(err.message).to.be.equal("Secret key is required for this method")
          done();
        });        
      })
/*
      it('Call method with secret key - should be ok', function(done) {

        let mockAdapter = new MockAdapter(axios);

         mockAdapter.onGet('https://www.binance.com/api/v3/allOrders').reply(200, {
           data: {
             posts: ['Intro to git']
           }
         });
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        instance.allOrders({symbol: "BNBBTC"}).then((data) => {
          //TODO assert
          done();
        }).catch((err) => {
          console.log(err);
           done(new Error('Expected method to resolve'))
        });
                  
      })

      it('openOrders - should be ok', function(done) {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        instance.openOrders().then((data) => {
          //TODO assert
          console.log(data);
          done();
        }).catch((err) => {    
          console.log(err);
           done(new Error('Expected method to resolve'))
        });
                  
      })
      it('queryOrders - should be ok', function(done) {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        instance.query_order('LTCBTC',45755261).then((data) => {
          //TODO assert
          console.log(data);
          done();
        }).catch((err) => {    
          console.log(err);
           done(new Error('Expected method to resolve'))
        });
                  
      })      
      it('cancel order - should be ok', function(done) {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        instance.cancel('LTCBTC',45755261).then((data) => {
          //TODO assert
          console.log(data);
          done();
        }).catch((err) => {    
          console.log(err);
           done(new Error('Expected method to resolve'))
        });
                  
      })       
      it('buy order - should be ok', function(done) {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        instance.buy_limit('LTCBTC',1500,0.000001).then((data) => {
          //TODO assert
          console.log(data);
          done();
        }).catch((err) => {    
          console.log(err);
           done(new Error('Expected method to resolve'))
        });
                  
      })
      */
      /*
    it('sell order - should be ok', function(done) {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        instance.sell_limit('TRXBTC',1500,0.001).then((data) => {
          //TODO assert
          console.log(data);
          done();
        }).catch((err) => {    
          console.log(err);
           done(new Error('Expected method to resolve'))
        });
                  
      })
      */            
    })
    
    describe('\n makeQuery', function() {
      it('Call method without api key - should throw an exception', function() {
        const instance = new Binance()
        expect( function(){  instance.makeQuery() }).to.throw("API key is required for this method")
      })

      it('Call method without secret key - should throw an exception', function() {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A"
        }
        const instance = new Binance(conf)
        expect( function(){  instance.makeQuery() }).to.throw("Secret key is required for this method")
      })

      it('Call method without url - should throw an exception', function() {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        expect( function(){  instance.makeQuery() }).to.throw("Url is missing and should be a string")
      })

      it('Call method with bad type for data param - should throw an exception', function() {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        expect( function(){  instance.makeQuery("url", true) }).to.throw("Object type required for data param")
      })

      it('Call method with good param - should be ok', function() {
        const conf = {
          api: "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",
          secret: "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
        }
        const instance = new Binance(conf)
        const val = instance.makeQuery("depth", {symbol: "GASBTC"}, 1508279351690)
        expect(val).to.be.equal("depth?symbol=GASBTC&timestamp=1508279351690&signature=10737f0f87e01e7b4d085ff19ed4549b291fee038c4209ff55e72ae28e4f9b1d")
      })


    })
  })