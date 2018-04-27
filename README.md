# gekkoIndicators
Custom gekko indicators for cryptocurrency trading

When writting long strategies, the current indicators add unnecessary complexity. Having the basic indicator logic in the indicator itself helps clean the strategy logic making it more readable and easier to improve.

These will replace built indicators without breaking current strategy since .result is still the same. However, you must at a minimum, add the settings.

GE_RSI :

    indicatorName.result: RSI value. 
    indicatorName.recommendation: 'short' or 'long' based on the settings.
    indicatorName.short_counter:
    Strat must pass the following settings to the indicator:
    {
      interval: this.settings.interval, // this.settings.whateverYourTomlFileCallsThese
      buy: this.settings.buy,
      sell: this.settings.sell,
      persistence: this.settings.persistence
    }
