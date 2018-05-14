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


module.exports.print = print;
module.exports.wait = wait;
module.exports.format = format;
module.exports.checkEnum = checkEnum;