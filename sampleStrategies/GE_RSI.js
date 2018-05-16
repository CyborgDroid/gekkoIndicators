/*

 RSI - CyborgDroid

*/ 

var _ = require('lodash');
var log = require('../core/log.js');
var RSI = require('./indicators/GE_RSI.js');

var method = {};

method.init = function() {
  log.debug(this.settings);
  this.RSI = new RSI(this.settings);
}

method.check = function(candle) {
  this.RSI.update(candle);
  this.advice(this.RSI.recommendation)
  this.duration = this.RSI.short_counter || this.RSI.long_counter || 0;
  if (this.duration){
    console.log(candle.start.format(), 'Price: ', candle.close, '\t RSI: ', this.RSI.result, 
    '\t Duration: ', this.duration, 'candle(s)');
  }
}

module.exports = method;
