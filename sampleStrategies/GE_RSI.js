/*

 RSI - CyborgDroid

*/ 

var _ = require('lodash');
var log = require('../core/log.js');

var method = {};

method.init = function() {
  log.debug(this.settings);
  this.addIndicator('RSI', 'GE_RSI', this.settings);
}

method.check = function(candle) {
  this.advice(this.indicators.RSI.recommendation)
  this.duration = this.indicators.RSI.short_counter || this.indicators.RSI.long_counter || 0;
  if (this.duration){
    console.log(candle.start.format(), 'Price: ', candle.close, '\t RSI: ', this.indicators.RSI.result, 
    '\t Duration: ', this.duration, 'candle(s)');
  }
}

module.exports = method;
