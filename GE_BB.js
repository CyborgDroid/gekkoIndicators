// no required indicators
// Bollinger Bands - CyborgDroid edit

var Indicator = function(BBSettings) {
    this.input = 'price';
    this.settings = BBSettings;
    if (!this.settings.hasOwnProperty('NbDevUp')) this.settings.NbDevUp = 2;
    if (!this.settings.hasOwnProperty('NbDevDn')) this.settings.NbDevDn = 2;
    if (!this.settings.hasOwnProperty('short_persistence')) this.settings.short_persistence = 0;
    if (!this.settings.hasOwnProperty('long_persistence')) this.settings.long_persistence = 0;
    // Settings:
    //    interval: The amount of samples used for the average.
    //    NbDevUp: The distance in stdev of the upper band from the SMA.
    //    NbDevDn: The distance in stdev of the lower band from the SMA.
    //    short / long counters: how many times the upper band must be violated before selling / buying
    this.prices = [];
    this.diffs = [];
    this.age = 0;
    this.sum = 0;
    this.sumsq = 0;
    this.upper = 0;
    this.middle = 0;
    this.lower = 0;
    this.recommendation = '';
    this.short_counter = 0;
    this.long_counter = 0;
    //for multitimframe inception:
    this.update = this.update.bind(this);
  }

  Indicator.prototype.update = function(price) {
    var tail = this.prices[this.age] || 0; // oldest price in window
    var diffsTail = this.diffs[this.age] || 0; // oldest average in window

    this.prices[this.age] = price;
    this.sum += price - tail;
    this.middle = this.sum / this.prices.length; // SMA value

    this.diffs[this.age] = (price - this.middle);
    //this.sumsq += this.diffs[this.age] ** 2  - diffsTail ** 2;
    this.sumsq += Math.pow(this.diffs[this.age], 2)  - Math.pow(diffsTail, 2);

    var stdev = Math.sqrt(this.sumsq / this.prices.length);

    this.upper = this.middle + this.settings.NbDevUp * stdev;
    this.lower = this.middle - this.settings.NbDevDn * stdev;

    this.result = ((price - this.middle) / stdev).toFixed(2);

    if (price >= this.upper) {
      this.short_counter++;
    } else {
      this.short_counter = 0;
    }
    if (this.short_counter >= this.settings.short_persistence){
      this.recommendation = 'short';
    }
    if (price <= this.lower){
      this.long_counter++;
    } else {
      this.long_counter = 0;
    }
    if(this.long_counter >= this.settings.long_persistence){
      this.recommendation = 'long';
    }

    this.age = (this.age + 1) % this.settings.interval
  }
  module.exports = Indicator;
