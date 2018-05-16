"use strict"

const axios = require("axios")
const getSignature = require('./signature')

/**
 * return an axios instance with base url and default header
 * @param  {Object} config config provided to the binance rest constructor
 * @return {Axios}         an axios instance
 */
const binanceRequest = function(config = {}) {
  const { api, secret, timeout } = config

	const axiosDefinition = {
    	baseURL: "https://www.binance.com/"
  }

  if (api) {
   	axiosDefinition.headers = {'X-MBX-APIKEY': api}
	}

  if (timeout) {
  	axiosDefinition.timeout = timeout
  }

  return axios.create(axiosDefinition)
}

module.exports = binanceRequest