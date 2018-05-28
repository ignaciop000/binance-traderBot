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
    let aSecs = ["10", "15", "20", "30", "60", "120", "300", "600", "900"];
    for (let sec of aSecs) {
      obj[sec] = {}
      obj[sec].time_stamp = initial_timestamp;
      obj[sec].start_bid_price = parseFloat(currency.b);
      obj[sec].flag = sec+'S FLAG!';
      obj[sec].time = parseInt(sec) * 1000;
    }
   /* 
    
    self.open_price = float(currencyArray['o'])                                             #open price
    self.high_price = float(currencyArray ['h'])                                            #high price
    self.low_price = float(currencyArray['l'])                                              #low price
    self.number_of_trades = float(currencyArray['n'])                                         #total number of trades
    self.price_change = float(currencyArray['p'])                                           #price change
    self.percent_change = float(currencyArray['P'])                                           #% price change
    */
  
  return obj;
}


module.exports.print = print;
module.exports.wait = wait;
module.exports.format = format;
module.exports.checkEnum = checkEnum;
module.exports.generateCurrency = generateCurrency;
