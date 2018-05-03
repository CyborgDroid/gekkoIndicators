// required indicators
// SMA, std dev, and zscore for candlesize.
var Math = require('mathjs');

/*

config = {
  interval: 50,
  z_tolerance: 3,
  ignore_outliers: true
}

*/

var Indicator = function(config) {
    this.input = 'candle';
    this.ignore_outliers = config.ignore_outliers;
    this.interval = config.interval; // should be long
    this.z_tolerance = config.z_tolerance; // zscore trigger, should be between 2 and 3 for a bell curve distribution
    this.volumes = []; //excludes ones that violate 3 std dev rule
    this.mean = 0;
    this.age = 0;
    this.sum = 0;
    this.std_dev = 0;
    this.zscore = 0;
    this.variance = 0;
    this.values = [];
  }
  
  Indicator.prototype.update = function(new_value) {
    //check if new value is outlier to exclude from calculations. Only do so if we have a complete dataset.
    let zscore_violation = new_value > this.mean+(3*this.std_dev) && this.values.length === this.interval;
    if (!zscore_violation && !this.ignore_outliers) {
      //add value to beginning of value list
      this.values.unshift(value);
      //check if first run
      let first_complete_run = this.values.length === this.interval;
      //get oldest value that should be deleted and delete it if values are longer than interval
      let tail_value = this.values.length > this.interval ? this.values.pop() : this.values[this.values.length-1];
      this.sum += new_value - tail_value;
      let new_mean = this.sum / this.values.length;
      // when the first whole interval is reached, calculate the initial variance etc:
      if(first_complete_run)this.variance = Math.var(this.values);
      // otherwise update variance
      else this.variance = (new_value-tail_value)*(new_value-new_mean+tail_value-this.mean)
                              /(this.values.length - 1);
      this.std_dev = Math.sqrt(this.variance);
      this.mean = new_mean;
    }
    //calculate zscore.
    this.zscore = (new_value - this.mean) / this.std_dev;
    this.violation = this.zscore > this.z_tolerance ? true : false;
  }
  
  module.exports = Indicator;