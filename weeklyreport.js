const OPEN = 0, HIGH = 1, LOW = 2, CLOSE = 3, BASEVOLUME = 4, QUOTEVOLUME = 5, CANDLEVALUES = 6;

export function task({ symbols, candles }) {

    const list = ["BTC", "BNB", "ETH", "LINK", "DOT", "XLM", "ALGO", "ATOM", "BAND", "BAT",
				  "ADA", "VET", "UNI", "OMG", "SUSHI", "XMR", "EGLD"].map(x => x + "USDT")

    const data = list.map(s => {
		
        const sticks = candles(s, 7 * 24 * 60)
		let low = sticks[CLOSE];
		let high = sticks[CLOSE];
		const count = sticks.length / CANDLEVALUES;

		for (let i = 0; i < count; i++) {
			const price = sticks[(i * CANDLEVALUES) + CLOSE]
			if (price < low) low = price;
			if (price > high) high = price;
		}
		
		return {
			symbol: s,
			low,
			high,
			price: sticks[sticks.length - CANDLEVALUES + CLOSE]
		}
    })
	
	data.sort((a, b) => (b.price/b.low) - (a.price/a.low)).forEach(x => {
		console.log(`${x.symbol} ${x.low} ${x.price} ${x.high}`)
	})
}
