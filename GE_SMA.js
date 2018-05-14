// Simple Moving Average 0(1) implementation

var Indicator = function(interval) {
  this.input = 'price';
  this.interval = interval;
  this.prices = [];
  this.result = 0;
  this.sum = 0;
  this.beyond_first_complete_run = false;
}

Indicator.prototype.update = function(price) {
  //add price to beginning of array
  this.prices.unshift(price);
  if (!this.beyond_first_complete_run){
    this.beyond_first_complete_run = this.prices.length > this.interval;
    this.sum += price;
    this.result = (this.sum / this.prices.length);
  } else {
    //add new price, then subtract oldest price and remove it from array
    this.sum += price - this.prices.pop();
  }
}

module.exports = Indicator;
