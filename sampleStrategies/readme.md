<b>RSI timeframe example runs an RSI plus a TakeProfit. </b>
The RSI is calculated every X minues (30, 15, etc) 
The TakeProfit is checked every minute.
start_whenever means that the candles start whenever (gekko default),
<i>set start_whenever=false so candles for the RSI start on the industry standard of
0 15, 30, 45 for 15m candles, etc.</i>
