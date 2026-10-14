---
title: How Adalytics tracks Cardano token prices on 3 API calls a minute
description: Live prices for every big Minswap pool on Koios's free tier, by asking a yes or no question before fetching anything.
date: 2026-10-14
tags: [Cardano, Go, Koios, APIs]
---

# How Adalytics tracks Cardano token prices on 3 API calls a minute

I built [Adalytics](https://github.com/Yadurshan-R/adalytics), a token dashboard for Cardano in the style of CoinGecko. Every price, chart and trade comes straight from the blockchain through the [Koios API](https://www.koios.rest), on the free tier.

![The Adalytics token list with prices, changes, volume and small price lines](/images/posts/adalytics/token-list.jpg)

The free tier allows 50,000 requests a day and 100 every 10 seconds. I wanted prices that refresh every minute for every token with a big Minswap pool, without going near that limit.

## Where a price comes from

Each token on Minswap V2 has a liquidity pool. On the blockchain, that pool is a single transaction output (UTxO) holding ADA on one side and the token on the other. The price is just the ratio:

```
price in ADA = ADA in the pool / tokens in the pool
```

When someone trades, that output is spent and a new one is created with the new amounts. Comparing the two tells you what happened. ADA in and tokens out is a buy. Tokens in and ADA out is a sell.

![A pool output before and after a swap of 1,000 ADA for SNEK. The price moves from 0.002687 to 0.002690 ADA](/images/posts/adalytics/pool-swap.png)

*Numbers are rounded and ignore Minswap's fee.*

## Ask a yes or no question first

Most minutes, most tokens don't trade. So instead of downloading every pool's data each minute, Adalytics first asks Koios one cheap question: **has this pool output been spent since I last looked?**

![Every minute, ask Koios if each pool output was spent. If not, stop. If yes, read only the new transactions and update that token](/images/posts/adalytics/minute-loop.png)

Koios's `utxo_info` endpoint answers that for 50 outputs in one request. Only the pools that were spent get their new transactions read. This is the core of it, from `update.go` (error handling left out):

```go
// Ask Koios about the pool outputs, 50 per request.
for start := 0; start < len(refs); start += 50 {
    batch, err := t.client.UTxOInfo(ctx, refs[start:min(start+50, len(refs))])
    utxos = append(utxos, batch...)
}

// Anything still unspent had no trade. Skip it.
unspent := map[string]bool{}
for _, u := range utxos {
    if !u.IsSpent {
        unspent[u.Ref()] = true
    }
}

// Only if something was spent, read the new transactions.
if spent > 0 {
    txs, err := t.client.AddressTxs(ctx, list, fromHeight, nil)
    found, err = t.readPools(ctx, txs, nil)
}
```

On a normal minute that is 3 requests: one for the latest block, and two `utxo_info` calls for around 60 pools. The backend prints a line every minute, so I can see it working:

```
13:21:00 INFO  market  Checked 61 pools: 2 had new swaps
```

## What that costs in a day

Three requests a minute is about 4,300 a day, under 9% of the free tier.

![A bar showing about 4,300 Koios requests a day against the free tier limit of 50,000](/images/posts/adalytics/koios-usage.png)

The backend also uses about 25 MB of memory with a day of history loaded, and sits close to 0% CPU between checks.

## Staying under the limit by design

Being far below the limit on average isn't enough. Startup loads a day of history at once, and that could hit the limit in a burst. So every request goes through a small rate limiter set below what Koios allows:

```go
limit: &limiter{max: 90, window: 10 * time.Second},
```

Koios allows 100 requests every 10 seconds. I set it to 90 to leave some room. If Koios still says it is busy, the client waits for the time in its `Retry-After` header (or 60 seconds if there isn't one) and tries again.

## What it doesn't do yet

- **Minswap V2 only.** Tokens that mostly trade on other exchanges show less volume here than on sites that combine every exchange.
- **Memory only.** There is no database, so after a restart the 30 days of history load again from Koios.
- **Batched orders.** Minswap fills orders in batches, so two people's orders in one transaction show as one trade.

The code is on [GitHub](https://github.com/Yadurshan-R/adalytics), and the README explains how to run it with your own free Koios key. If you've built something on Koios, I'd like to hear how you kept your request count down.
