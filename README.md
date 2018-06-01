# gekkoIndicators
Custom gekko indicators for cryptocurrency trading

When writting complex strategies, the current indicators add unnecessary complexity. Having the basic indicator logic in the indicator itself helps clean the strategy logic making it more readable and easier to improve.

All indicators have:

    this.recommendation:   'short' or 'long'
    this.result:            raw indicator result
    Default settings: automatically applied if the settings are not passed to the indicator.

An RSI strategy logic can literally have one line of code, making complex logic easy:

    this.advice(this.indicators.RSI.recommendation);

GE_RSI :

    this.result: RSI value. 
    this.short_counter & .long_counter: count the persistence for RSI violations.
    this.recommendation: 'short', 'long', or ''.
                                RSI must persist past the persistence threshold for a 'long' or 'short' reco.     
                                Reco will return to false as soon as RSI is not violated.
                                
    Strat should pass the following settings to the indicator (or default will be applied):
    {
      interval: this.settings.interval,         // DEFAULT : 14
      buy: this.settings.buy,                   // DEFAULT : 30
      sell: this.settings.sell,                 // DEFAULT : 70
      persistence: this.settings.persistence    // DEFAULT : 0
    }

GE_EMA_updown & GE_DEMA_updown:

    this.result: EMA value
    this.updown: up or down relative to prior value
    this.change: % change relative to prior value
    
    Strat should pass the following settings to the indicator (or default will be applied):
    {
        weight: this.settings.weight,            // DEFAULT : 7
        min_change: this.settings.min_change    //  DEFAULT : 0 (no change). This must be a tiny number
    }

GE_BB: (Bollinger Bands & Z-score)

    this.recommendation = 'short', 'long', or ''. Whether zscore is greater than tolerance limits.
    this.result         = zscore. Can be used to identify anomalies with price, # trades, volume, or anything else.
    
    Strat should pass the following settings to the indicator (or default will be applied):
    {
      interval: this.settings.interval,         // DEFAULT : 20
      NbDevUp: # of std devs for upper limit    // DEFAULT : 2
      NbDevdown:  # of std devs for lower limit // DEFAULT : 2
      short_persistence:                        // DEFAULT : 0
      long_persistence:                         // DEFAULT : 0
      
    }
    
MC_BB is same as GE_BB, however, the recommendation triggers until after the price closes inside the bollinger band range.

GE_MACD:

    this.recommendation = 'short' = histogram slope is positive & value is negative
                          'long'  = histogram slope is negative & value is positive
                          ''      = neither
    this.result         =   MACD - signal
    
    this.short.result       short EMA
    this.long.result        long EMA
    this.MACD               short EMA - long EMA
    this.signal.result      MACD EMA
    
    Strat should pass the following settings to the indicator (or default will be applied):
    {
      short:        EMA interval        // DEFAULT : 12
      long:         EMA interval        // DEFAULT : 26
      signal:       EMA interval        // DEFAULT : 9
      short_persistence:                // DEFAULT : 0
      long_persistence:                 // DEFAULT : 0
    }
    
GE SMA & SMMA:
    
    SMMA doesn't grow to infinity saving all prices like the built-in GEKKO SMMA, otherwise the same functionality. 
    No recommendation.
