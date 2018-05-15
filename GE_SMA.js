// Simple Moving Average 0(1) implementation

var Indicator = function(interval) {
  this.input = 'price';
  this.interval = interval;
  this.prices = [];
  this.result = 0;
  this.sum = 0;
  this.complete_data = false;
}

Indicator.prototype.update = function(price) {
  //add price to beginning of array
  this.prices.unshift(price);
  if (!this.complete_data){
    this.complete_data = this.prices.length == this.interval;
    this.sum += price - 0;
    this.result = (this.sum / this.prices.length);
  } else {
    //add new price, then subtract oldest price and remove it from array
    let tail = this.prices.pop();
    this.sum += (price - tail);
    this.result = (this.sum / this.interval);
  }
}

module.exports = Indicator;
