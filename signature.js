"use stric"

const crypto = require('crypto')

/**
 * get the signature of a query string
 * @param  {String} query the query string
 * @param  {String} key   the secret key
 * @return {String}       the signature
 */
const getSignature = function(query, key) {

  if (!query || typeof query !== "string")
    throw "query is missing or bad format"

  if (!key || typeof key !== "string")
    throw "key is missing or bad format"

  return crypto.createHmac('sha256', key).update(query).digest('hex')
}

module.exports = getSignature