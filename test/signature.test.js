"use strict"

const assert = require('assert')
const expect = require('chai').expect
const getSignature = require('../signature')

describe('getSignature', function() {

      it('Call without param - should throw an exception', function() {
        expect( function(){  getSignature() }).to.throw("query is missing or bad format")
      })

      it('Call with bad query format - should throw an exception', function() {
        expect( function(){  getSignature(true) }).to.throw("query is missing or bad format")
      })

      it('Call without key param - should throw an exception', function() {
        expect( function(){  getSignature("test") }).to.throw("key is missing or bad format")
      })

      it('Call with bad key format - should throw an exception', function() {
        expect( function(){  getSignature("test", true) }).to.throw("key is missing or bad format")
      })

      it('Call with good params - should be ok', function() {
        const val = getSignature("depth?symbol=GASBTC&timestamp=1508279351690","NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j")
        expect(val).to.be.equal("32a4811fb6c2b79dbf81fed08bda5324e27e6d095b6d2a0a4a3bd6e012193833")
      })

})