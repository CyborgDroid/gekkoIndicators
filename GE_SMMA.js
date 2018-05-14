// SMMA does not grow to infinity like original gekko indicator

var SMA = require('./GE_SMA');

var Indicator = function (weight) {
  this.input = 'price';
  this.sma = new SMA(weight);
  this.weight = weight;
  this.result = 0;
}

Indicator.prototype.update = function (price) {
  if (this.sma.beyond_first_complete_run){
    this.result = (this.result * (this.weight - 1) + price) / this.weight;
  } else {
    this.sma.update(price)
    if (self.sma.prices.length === self.weight){
      this.result = this.sma.result
    }
  }

}

module.exports = Indicator;
