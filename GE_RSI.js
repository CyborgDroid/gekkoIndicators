// required indicators
var SMMA = require('./GE_SMMA.js');

var Indicator = function (settings) {
  this.input = 'candle';
  this.lastClose = null;
  if (settings.hasOwnProperty('interval')) this.interval = settings.interval;
  else this.interval = 10;
  if (settings.hasOwnProperty('sell')) this.sell = settings.sell;
  else this.sell = 70;
  if (settings.hasOwnProperty('buy')) this.buy = settings.buy;
  else this.buy = 30;
  if (settings.hasOwnProperty('persistence')) this.persistence = settings.persistence;
  else this.persistence = 0;
  this.avgU = new SMMA(this.interval);
  this.avgD = new SMMA(this.interval);
  this.u = 0;
  this.d = 0;
  this.rs = 0;
  this.result = 0;
  this.age = 0;
  //new settings
  this.recommendation = '';
  this.short_counter = 0;
  this.long_counter = 0;
  //for multitimframe inception:
  this.update = this.update.bind(this);
}

Indicator.prototype.update = function (candle) {
  //console.log('UPDATE THIS: \n', this);
  var currentClose = candle.close;
  this.recommendation = '';
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
  this.result = this.result.toFixed(2);
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
