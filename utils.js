'use strict'

const sprintf = require("sprintf-js").sprintf;

function print(message, ...args) {
	console.log(sprintf(message,...args));
}

function format(number) {
	return sprintf("%.8f",number);
}

function wait (timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

function checkEnum (possible, value, key) {
	if (possible.indexOf(value) === -1) { // to check an enum format
        throw new SyntaxError(key+" is not valid, possible values are "+possible.join(", "))
    }
    return null
}

function generateCurrency(currency) {
  let obj = {};
    obj.symbol = currency.s;  //symbol
    obj.bid_price = parseFloat(currency.b) //best bid price
    obj.ask_price = parseFloat(currency.a) //best ask price
    obj.volume = parseFloat(currency.q)    //volume
    let initial_timestamp = new Date().getTime() //initial timestamp
    obj.time_stamp = initial_timestamp;                                              
   /* 
    
    self.open_price = float(currencyArray['o'])                                             #open price
    self.high_price = float(currencyArray ['h'])                                            #high price
    self.low_price = float(currencyArray['l'])                                              #low price
    self.number_of_trades = float(currencyArray['n'])                                         #total number of trades
    self.price_change = float(currencyArray['p'])                                           #price change
    self.percent_change = float(currencyArray['P'])                                           #% price change
    
    
    self.ten_sec_time_stamp = initial_timestamp
    self.ten_sec_start_bid_price = float(currencyArray['b'])
    self.fifteen_sec_time_stamp = initial_timestamp
    self.fifteen_sec_start_bid_price = float(currencyArray['b'])
    self.twenty_sec_time_stamp = initial_timestamp
    self.twenty_sec_start_bid_price = float(currencyArray['b'])
    self.thirty_sec_time_stamp = initial_timestamp
    self.thirty_sec_start_bid_price = float(currencyArray['b'])
    self.one_min_time_stamp = initial_timestamp
    self.one_min_start_bid_price = float(currencyArray['b'])
    self.two_min_time_stamp = initial_timestamp
    self.two_min_start_bid_price = float(currencyArray['b'])
    self.five_min_time_stamp = initial_timestamp
    self.five_min_start_bid_price = float(currencyArray['b'])
    self.ten_min_time_stamp = initial_timestamp
    self.ten_min_start_bid_price = float(currencyArray['b'])
    self.fifteen_min_time_stamp = initial_timestamp
    self.fifteen_min_start_bid_price = float(currencyArray['b'])*/
  return obj;
}


module.exports.print = print;
module.exports.wait = wait;
module.exports.format = format;
module.exports.checkEnum = checkEnum;
module.exports.generateCurrency = generateCurrency;
