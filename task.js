const OPEN = 0, HIGH = 1, LOW = 2, CLOSE = 3, BASEVOLUME = 4, QUOTEVOLUME = 5, CANDLEVALUES = 6;

export function task({ symbols, candles }) {

    //const list = symbols().filter(s => s.endsWith('USDT'))
    const list = ["BTC", "BNB", "ETH", "LINK", "XLM", "ALGO", "ATOM", "BAND", "BAT",
				  "ADA", "VET", "UNI", "OMG", "SUSHI", "XMR"].map(x => x + "USDT")

    const data = list.map(s => {
	// 300 days of data
        const sticks = candles(s, 300 * 24 * 60)
	// 90 day moving average
        const avg = EMA(sticks, 90)
        const price = sticks[sticks.length - CANDLEVALUES + CLOSE]
        return {
            symbol: s,
            avg,
            price,
            change: -((avg - price) / avg) * 100
        }
    })
	
    console.log("--------------------------------------")

    data.sort((a, b) => a.change - b.change).forEach(d => {
		if (d.change > 0) return;
        console.log(`${d.symbol} down ${d.change.toFixed(2)}% at ${d.price.toFixed(3)} avg ${d.avg.toFixed(3)}`);
    })
    
    console.log("--------------------------------------")

    data.sort((a, b) => b.change - a.change).forEach(d => {
		if (d.change < 0) return;
        console.log(`${d.symbol} up ${d.change.toFixed(2)}% at ${d.price.toFixed(3)} avg ${d.avg.toFixed(3)}`);
    })
}


function EMA(data, days) {
	
	// 2.7182818
    const impact = 2 / (24 * 60 * days)

    let average = data[CLOSE];

    const count = data.length / CANDLEVALUES;

    for (let i = 0; i < count; i++) {
        const offset = i * CANDLEVALUES;
        const price = (data[offset + HIGH] + data[offset + LOW] + data[offset + CLOSE]) / 3;
        average = average + ((price - average) * impact)
    }

    return average
}
