const OPEN = 0, HIGH = 1, LOW = 2, CLOSE = 3, BASEVOLUME = 4, QUOTEVOLUME = 5, CANDLEVALUES = 6;

export function task({ symbols, candles }) {

    const list = symbols().filter(s => s.endsWith('USDT'))
    
    console.log(list)

    const data = list.map(s => {
        // past 75 days in minutes
        const sticks = candles(s, 75 * 24 * 60)
        const avg = EMA(sticks, 50)
        const price = sticks[sticks.length - CANDLEVALUES + CLOSE]
        return {
            symbol: s,
            avg,
            price,
            change: ((avg - price) / avg) * 100
        }
    })
	
    console.log("--------------------------------------")

    data.sort((a, b) => b.change - a.change).slice(0, 10).forEach(d => {
        console.log(`${d.symbol} down ${d.change.toFixed(2)}% at ${d.price.toFixed(3)} avg ${d.avg.toFixed(3)}`);
    })
    
    console.log("--------------------------------------")

    data.sort((a, b) => a.change - b.change).slice(0, 10).forEach(d => {
        console.log(`${d.symbol} up ${Math.abs(d.change).toFixed(2)}% at ${d.price.toFixed(3)} avg ${d.avg.toFixed(3)}`);
    })
}


function EMA(data, days) {

    const impact = 2.7182818 / (24 * 60 * days)

    let average = data[CLOSE];

    const count = data.length / CANDLEVALUES;

    for (let i = 0; i < count; i++) {
        const offset = i * CANDLEVALUES;
        const price = (data[offset + HIGH] + data[offset + LOW] + data[offset + CLOSE]) / 3;
        average = average + ((price - average) * impact)
    }

    return average
}
