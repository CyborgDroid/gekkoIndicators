// required indicators
var EMA = require('./GE_EMA_updown.js');

var Indicator = function(config) {
  this.input = 'candle';
  this.MACD = false;
  if (!config.hasOwnProperty('short')) config.short = 12;
  if (!config.hasOwnProperty('long')) config.long = 26;
  if (!config.hasOwnProperty('signal')) config.signal = 9;
  if (!config.hasOwnProperty('long_persistence')) config.long_persistence = 0;
  if (!config.hasOwnProperty('short_persistence')) config.short_persistence = 0;
  this.short = new EMA({'weight': config.short, 'min_change': 0});
  this.long = new EMA({'weight': config.long, 'min_change': 0});
  this.signal = new EMA({'weight': config.signal, 'min_change': 0});
  this.long_persistence = config.long_persistence;
  this.short_persistence = config.short_persistence;
  this.recommendation = '';
  //for multitimframe inception:
  this.update = this.update.bind(this);
}

Indicator.prototype.update = function(candle) {
price = candle.close;
  this.short.update(price);
  this.long.update(price);
  this.calculateEMAdiff();
  this.signal.update(this.MACD);
  let new_result = this.MACD - this.signal.result;
  //Calculate recommendation starting on second candle
  if (this.hasOwnProperty('result')){
    let slope = new_result<this.result ? 'down' : 'up';
    let pos_neg = new_result > 0 ? 'pos' : 'neg';
    if (slope == 'down' && pos_neg > 0){
        this.short_counter++;
    } else if (slope == 'up' && pos_neg < 0){
        this.long_counter++;
    } else{
        this.short_counter = 0;
        this.long_counter = 0;
    }
    if (this.short_counter >= this.short_persistence){
            this.recommendation = 'short';
            console.log('reco: ',this.recommendation,'short:' , this.short.result, 'long: ', this.long.result, 'signal: ', this.signal.result, 'slope: ', slope, 'pos_neg: ', pos_neg )
    } else if (this.long_counter >= this.long_persistence){
        this.recommendation = 'long';
        console.log('reco: ',this.recommendation,'short:' , this.short.result, 'long: ', this.long.result, 'signal: ', this.signal.result, 'slope: ', slope, 'pos_neg: ', pos_neg )
    } else {
        this.recommendation = '';
    }
  }
  this.result = new_result;
}

Indicator.prototype.calculateEMAdiff = function() {
  var shortEMA = this.short.result;
  var longEMA = this.long.result;

  this.MACD = shortEMA - longEMA;
}

module.exports = Indicator;
