// required indicators
var SMMA = require('./SMMA.js');

var Indicator = function (settings) {
  this.input = 'candle';
  this.lastClose = null;
  this.weight = settings.interval;
  this.sell = settings.sell;
  this.buy = settings.buy;
  this.persistence = settings.persistence;
  this.avgU = new SMMA(this.weight);
  this.avgD = new SMMA(this.weight);
  this.u = 0;
  this.d = 0;
  this.rs = 0;
  this.result = 0;
  this.age = 0;
  //new settings
  this.recommendation = false;
  this.short_counter = 0;
  this.long_counter = 0;
}

Indicator.prototype.update = function (candle) {
  var currentClose = candle.close;
  this.recommendation = false;
  if (this.lastClose === null) {
    // Set initial price to prevent invalid change calculation
    this.lastClose = currentClose;

    // Do not calculate RSI for this reason - there's no change!
    this.age++;
    return;
  }

  if (currentClose > this.lastClose) {
    this.u = currentClose - this.lastClose;
    this.d = 0;
  } else {
    this.u = 0;
    this.d = this.lastClose - currentClose;
  }

  this.avgU.update(this.u);
  this.avgD.update(this.d);

  this.rs = this.avgU.result / this.avgD.result;
  this.result = 100 - (100 / (1 + this.rs));

  if (this.avgD.result === 0 && this.avgU.result !== 0) {
    this.result = 100;
  } else if (this.avgD.result === 0) {
    this.result = 0;
  }

  //count the RSI violations and recommend an action based on the settings

  if (this.result > this.sell){
    this.short_counter++;
  } else {this.short_counter = 0;}
  if (this.result < this.buy && this.result > 0){
    this.long_counter++;
} else {this.long_counter = 0;}

if (this.short_counter > this.persistence) this.recommendation = 'short';
if (this.long_counter > this.persistence) this.recommendation = 'long';

this.lastClose = currentClose;
this.age++;
}

module.exports = Indicator;
