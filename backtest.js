export function initiate({ state }) {
    state.lastHigh = 0
    state.lastBuy = 0
}

export function trade({ state, exchange }) {

    const balance = exchange.balance()
    const cash = balance[state.quoteAsset()]
    const coins = balance[state.baseAsset()]

    const { sell, buy } = exchange.bestPrice(state.defaultSymbol())

    if (buy > state.lastHigh) state.lastHigh = buy

    // if price is 10% lower than the highest price, buy
    if (cash > 0 && buy < state.lastHigh * 0.90) {
        exchange.marketBuy(cash)
        state.lastBuy = buy
        console.log(`bought ${cash / buy} at ${buy}`)
    }

    // if price increases by 10% since last buy, sell
    if (coins > 0 && state.lastBuy > 0 && sell > state.lastBuy / 0.90) {
        exchange.marketSell(coins)
        state.lastHigh = sell
        console.log(`sold ${coins} at ${sell}`)
    }
}
