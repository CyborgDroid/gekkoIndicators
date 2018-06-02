/*

This strategy runs an RSI plus a TakeProfit. 
The RSI is calculated every X minues (30, 15, etc) 
The TakeProfit is checked every minute.

*/

var log = require('../core/log');
var util = require('../core/util.js');
var config = util.getConfig();
var _ = require('lodash');

var CandleBatcher = require('../core/candleBatcher');
var RSI = require('../strategies/indicators/GE_RSI.js');

/////////////////////////////////////////////////////////////////////
var strat = {};

/////////////////////////////////////////////////////////////////////
strat.init = function() {

  log.debug('Initialising multi timeframe strategy');
  log.debug(this.settings)

  // since we're relying on batching 1 minute candles into larger candles
  // lets throw if the settings are wrong
  if (config.tradingAdvisor.candleSize !== 1) {
    throw "This strategy must run with candleSize=1";
  }

  this.myIndicators = {};
  this.trend = {
      action_price : '',
      last_action: '',
      recommendation: ''
    };

  // gekko will be running on 1 minute timeline internally
  // so we create and maintain indicators manually in order to update them at correct time
  // rather than using this.addIndicator

    this.myIndicators.RSI = new RSI(this.settings.RSI);

    this.batcher = new CandleBatcher(this.settings.RSI.candle_size);
    
    this.batcher.on('candle', this.myIndicators.RSI.update);
    //this.batcher.on('candle', this.update15);
}

/////////////////////////////////////////////////////////////////////
strat.update = function(candle) {
    // write 1 minute candle to larger candle batchers
    this.batcher.write([candle]);
    if(this.myIndicators.RSI.result >= this.settings.RSI.sell){
        this.trend.recommendation = 'short';
    } else if (this.myIndicators.RSI.result <= this.settings.RSI.buy && this.myIndicators.RSI.result > 0){
        this.trend.recommendation = 'long';
    }
    if (this.trend.last_action === 'buy') { 
        if (candle.close > this.takeProfit) {
            this.trend.recommendation = 'short';
        }
    }

}

// strat.update15 = function(candle){
//     this.myIndicators.RSI.update(candle);
// }

strat.check = function(candle) {
    if (this.trend.recommendation){
        this.advice(this.trend.recommendation);
    }
}

strat.onTrade = function(event){
    if(event.action === 'buy'){
        this.takeProfit = event.price * this.settings.profitRatio;
        log.debug(event.date.format(), ' buy at: ', event.price, 
        ' | takeProfit: ' + this.takeProfit.toFixed(8));
        this.trend.action_price = event.price;

    } else {
        log.debug(event.date.format(), ' sell at ' , event.price,
        ' | P/L: ' + ((event.price - this.trend.action_price)/this.trend.action_price).toFixed(3));
    }
    this.trend.last_action = event.action;
}

module.exports = strat;
