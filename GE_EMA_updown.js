/*

config = {
    weight: 10,
    min_change: 0.0001 // min change in percent, must be very small.
}

*/

var Indicator = function(config) {
  this.input = 'price';
  this.weight = config.weight;
  this.min_change = config.min_change;
  this.prev_EMA = false;
  this.change = false;
  this.result = false;
  this.updown = '';
  this.age = 0;
}

Indicator.prototype.update = function(price) {
  // The first time we can't calculate based on previous
  // ema, because we haven't calculated any yet.
  if(this.result === false)
    this.result = price;

  this.age++;
  this.calculate(price);

  return this.result;
}

//    calculation (based on tick/day):
//  EMA = Price(t) * k + EMA(y) * (1 – k)
//  t = today, y = yesterday, N = number of days in EMA, k = 2 / (N+1)
Indicator.prototype.calculate = function(price) {
  // weight factor
  var k = 2 / (this.weight + 1);

  // yesterday
  var y = this.prev_EMA;

  // calculation
  this.result = price * k + y * (1 - k);
  this.cur_EMA = this.result;

  if (this.prev_EMA && this.cur_EMA && (Math.abs(this.cur_EMA - this.prev_EMA) / this.prev_EMA) > this.min_change){
    this.updown = this.prev_EMA > this.cur_EMA ? 'down' : 'up';
    this.change = this.cur_EMA / this.prev_EMA;
  } else {this.result = false;}

  //console.log('EMA result: ', this.result, 'EMA updown: ', this.updown);

  this.prev_EMA = this.cur_EMA;
  this.cur_EMA = false;
}

module.exports = Indicator;
