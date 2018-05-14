"use strict"

const assert = require('assert')
const expect = require('chai').expect
const { checkEnum } = require('./../utils');

describe('utils', function() {

    describe('checkEnum', function() {
      it('Call with wrong enum - should throw an exception', function() {
        expect( function(){  checkEnum(["BUY", "SELL"], "FLUX", "testKey") }).to.throw("testKey is not valid, possible values are BUY, SELL")
      })

      it('Call with good enum - should return null', function() {
        const val = checkEnum(["BUY", "SELL"], "BUY", "testKey")
        expect(val).to.be.null
      })

    })
})