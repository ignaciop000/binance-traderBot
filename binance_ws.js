"use strict"

const WebSocket = require('ws');

const baseURL = "wss://stream.binance.com:9443/ws/"; // base url used for websocket



class BinanceWS {

  constructor() {        
    this.sockets = {} // Object to keep socket reference to prevent multiple declaration
  }

  initSocket (path, callback){
    if (!path || typeof path !== "string") {
      throw "path is required and should be a string"
    }

    if (!callback || typeof callback !== "function") {
      throw "callback is required and should be a function"
    }

    if (this.sockets[path]) {// if an reference exist
      return this.sockets[path] // return it
    } else {
      const ws = new WebSocket([ baseURL, path ].join("")) // create websocket instance
      ws.on('message', callback) // bind callback with received data
      this.sockets[path] = ws // save the reference
      return ws
    }
  }

  getSockets() {
    return this.sockets;
  }

  close() {
    for (let s in this.sockets){
      try{
        this.sockets[s].close();
      } catch(e){

      }
    }    
  }
}


module.exports = BinanceWS