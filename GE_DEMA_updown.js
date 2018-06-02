// required indicators
var EMA = require('./EMA.js');

/*

config = {
    weight: 10,
    min_change: 0.0001 // min change in percent, must be very small.
}

*/

var Indicator = function(config) {
  this.input = 'price'
  this.result = false;
  this.updown = '';
  this.min_change = config.min_change;
  this.inner = new EMA(config.weight);
  this.outer = new EMA(config.weight);
  //for multitimframe inception:
  this.update = this.update.bind(this);
}

// add a price and calculate the EMAs and
// the result
Indicator.prototype.update = function(price) {
  this.inner.update(price);
  this.outer.update(this.inner.result);
  this.result = 2 * this.inner.result - this.outer.result;
  this.cur_DEMA = this.result;
  if (this.prev_DEMA && this.cur_DEMA && (Math.abs(this.cur_DEMA - this.prev_DEMA) / this.prev_DEMA) > this.min_change){
    this.updown = this.prev_DEMA > this.cur_DEMA ? 'down' : 'up';
    this.change = this.cur_DEMA / this.prev_DEMA;  
  }
  this.prev_DEMA = this.result;
  this.cur_DEMA = false;
}

module.exports = Indicator;
