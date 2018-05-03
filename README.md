# gekkoIndicators
Custom gekko indicators for cryptocurrency trading

When writting long strategies, the current indicators add unnecessary complexity. Having the basic indicator logic in the indicator itself helps clean the strategy logic making it more readable and easier to improve.

These will replace built-in indicators without breaking current strategy since .result method is still the same. However, you must at a minimum, add the settings.

GE_RSI :

    indicatorName.result: RSI value. 
    indicatorName.short_counter & .long_counter: count the persistence for RSI violations.
    indicatorName.recommendation: 'short', 'long', or false. 
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

    indicatorName.result: EMA value
    indicatorName.updown: up or down relative to prior value
    indicatorName.change: % change relative to prior value
    
    Strat must pass the following settings to the indicator:
    {
        weight: this.settings.weight, // ex: 50, 100, etc.
        min_change: this.settings.min_change // ex: 0.0001, min change in percent relative to prior value. zero to ignore limitation.
    }

GE_zscore:

    indicatorName.zscore = zscore value
    indicatorName.violation = true / false. Whether zscore is greater than tolerance.
    
     Strat must pass the following settings to the indicator:
    {
      interval: this.settings.interval, // the longer the better to detect anomalies.
      z_tolerance: this.settings.z_tolerance, // value typically 1.5, 2 or 3 but could be set higher.
      ignore_outliers: this.settings.ignore_outliers // true or false. To avoid including outliers in the calculation of the mean and standard deviation. I suggest true.
    }
