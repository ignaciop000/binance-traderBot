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

module.exports.print = print;
module.exports.wait = wait;
module.exports.format = format;