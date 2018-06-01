# gekkoIndicators
Custom gekko indicators for cryptocurrency trading

When writting complex strategies, the current indicators add unnecessary complexity. Having the basic indicator logic in the indicator itself helps clean the strategy logic making it more readable and easier to improve.

All indicators have:

    this.recommendation:   'short' or 'long'
    this.result:            raw indicator result
    Default settings: automatically applied if the settings are not passed to the indicator.

An RSI strategy can literally have one line of code, making complex logic easy:

    this.advice(this.indicators.RSI.recommendation);

GE SMA & SMMA:
    
    SMMA doesn't grow to infinity saving all prices like the built-in SMMA, otherwise the same functionality.

GE_RSI :

    this.result: RSI value. 
    this.short_counter & .long_counter: count the persistence for RSI violations.
    this.recommendation: 'short', 'long', or false. 
                                RSI must persist past the persistence threshold for a 'long' or 'short' reco.     
                                Reco will return to false as soon as RSI is not violated.
                                
    Strat must pass the following settings to the indicator:
    {
      interval: this.settings.interval, // this.settings.whateverYourTomlFileCallsThese
      buy: this.settings.buy,
      sell: this.settings.sell,
      persistence: this.settings.persistence
    }

GE_EMA_updown & GE_DEMA_updown:

    this.result: EMA value
    this.updown: up or down relative to prior value
    this.change: % change relative to prior value
    
    Strat must pass the following settings to the indicator:
    {
        weight: this.settings.weight, // ex: 50, 100, etc.
        min_change: this.settings.min_change // ex: 0.0001, min change in percent relative to prior value. zero to ignore limitation.
    }

GE_BB:

    this.recommendation = 'short' 'long'. Whether zscore is greater than tolerance.
    this.result         = zscore. Can be used to identify anomalies with price, # trades, volume, or anything else.
    
     Strat must pass the following settings to the indicator:
    {
      interval: this.settings.interval, // default : 20
      
    }
