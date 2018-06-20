/*

This strategy runs an RSI plus a TakeProfit. 
The RSI is calculated every X minues (30, 15, etc) 
The TakeProfit is checked every minute.
start_whenever means that the candles start whenever (gekko default),
set start_whenever=false so candles for the RSI start on the industry standard of
0 15, 30, 45 for 15m candles, etc.

*/

const log = require('../core/log');
const util = require('../core/util.js');
const config = util.getConfig();
const _ = require('lodash');
const moment = require('moment');


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
    // write 1 minute candle to larger candle batchers if starting whenever
    // else wait until the minutes are divisible by the candlesize before starting
    if (this.settings.start_whenever){
        this.batcher.write([candle]);
    } else if (parseFloat(moment(candle.start).format('mm')) % this.settings.RSI.candle_size === 0){
        this.settings.start_whenever = true;
        console.log('candle batching starts at this time:' , candle.start.format())
        this.batcher.write([candle]);
    }
    
    if(this.trend.last_action === 'buy' && this.myIndicators.RSI.result >= this.settings.RSI.sell){
        this.trend.recommendation = 'short';
    } else if (this.trend.last_action !== 'buy' && this.myIndicators.RSI.result <= this.settings.RSI.buy && this.myIndicators.RSI.result > 0){
        this.trend.recommendation = 'long';
    }
    if (this.trend.last_action === 'buy') { 
        if (candle.close > this.takeProfit && this.takeProfit !== 0) {
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
        //add one minute to the candle start to get candle end for 1m candles
        console.log(moment(event.date).add(1,'m').format(), ' buy at: ', event.price, 
        ' | takeProfit: ' + this.takeProfit.toFixed(8));
        this.trend.action_price = event.price;

    } else {
        //add one minute to the candle start to get candle end for 1m candles
        console.log(moment(event.date).add(1,'m').format(), ' sell at ' , event.price,
        ' | P/L: ' + ((event.price - this.trend.action_price)/this.trend.action_price).toFixed(3));
    }
    this.trend.last_action = event.action;
}

module.exports = strat;
