<b><h2>Strategy Examples</b></h2>

<b>RSI multi-timeframe example runs an RSI plus a TakeProfit. </b><br />
The RSI is calculated every X minues (30, 15, etc) <br />
The TakeProfit is checked every minute.<br />
set profitRatio=0 to disable takeProfit <br />
start_whenever means that the candles start whenever (gekko default),<br />
<i>set start_whenever=false so candles for the RSI start on the industry standard of
0 15, 30, 45 for 15m candles, etc.</i>
<br /><br />
<b> GE_RSI.js </b> <br />
Shows how to use these indicators that output a <i>this.recommendation</i> to simplify your strategies and make them much more complex but readable.   
