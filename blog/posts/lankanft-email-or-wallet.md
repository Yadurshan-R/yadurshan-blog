---
title: Email or Lace wallet, one Cardano NFT app
description: How LankaNFT lets people without a wallet mint NFTs, and the signing bug that took me six hours.
date: 2026-10-14T12:00:00
tags: [Cardano, MeshSDK, Lace, Go]
---

# Email or Lace wallet, one Cardano NFT app

[LankaNFT](https://github.com/Yadurshan-R/LankaNFT_Cardano) is an app for minting and trading NFTs on Cardano Preprod. I wanted someone who knows nothing about crypto to be able to use it. Most people don't have a wallet, so you can sign in two ways: with your email, or with a Lace wallet if you already have one.

![The LankaNFT sign in page with two tabs, Email OTP and Connect Wallet](/images/posts/lankanft/sign-in.jpg)

Both ways can do everything: mint, batch mint, list, buy, cancel and transfer. Behind each button there are two different paths.

![Email users: the backend decrypts their key and MeshSDK builds, signs and submits. Lace users: MeshSDK builds an unsigned transaction, the user signs in Lace, and the backend adds the signature and submits through Blockfrost](/images/posts/lankanft/two-paths.png)

## Email users

When you sign in with email for the first time, the app creates a Cardano wallet for you. Its recovery words are encrypted with AES-256-GCM before they go into the database, and are only decrypted on the server when you do something. MeshSDK then builds, signs and submits the transaction in one step.

This is a custodial wallet: the app holds the key, not you. For a beginner on a test network I think that is fine, and anyone who wants full control can use Lace instead.

## Lace users

The key never leaves the browser. The server only builds the transaction without a signature and sends it to the frontend as CBOR (the raw transaction bytes). Lace asks the user to approve it:

```ts
// partialSign = true: Lace adds its signature and leaves the rest alone
const signedCbor = await walletApi.signTx(unsignedCbor, true)
```

Lace sends back only its signature. The server has to put that into the transaction and submit it. That last step is where I lost six hours.

## The bug: MissingScriptWitnesses

My first version took Lace's witness set (the part of a transaction that holds the signatures and scripts) and used it as the transaction's witness set. Cardano rejected every mint with `MissingScriptWitnesses` or `ScriptIntegrityHashMismatch`.

The reason: MeshSDK had already put the minting script, redeemer and datum into the unsigned transaction's witness set. Lace's witness set only has the signature. By swapping one for the other, I threw the script away.

![First try: MeshSDK's witnesses replaced by Lace's, rejected. The fix: MeshSDK's witnesses plus Lace's signature, accepted](/images/posts/lankanft/witness-fix.png)

I found the answer by reading how other Cardano projects on GitHub do it. The fix is to keep the original witness set and only add Lace's signatures to it:

```ts
const unsignedTx = CSL.Transaction.from_hex(unsigned_cbor)
const laceWitnesses = CSL.TransactionWitnessSet.from_hex(witness_cbor)

// Keep the script, redeemer and datum MeshSDK put in. Only add Lace's signatures.
const witnessSet = unsignedTx.witness_set()
const vkeys = witnessSet.vkeys() ?? CSL.Vkeywitnesses.new()
const laceVkeys = laceWitnesses.vkeys()
if (laceVkeys) {
  for (let i = 0; i < laceVkeys.len(); i++) vkeys.add(laceVkeys.get(i))
}
witnessSet.set_vkeys(vkeys)

// The body is unchanged, so Lace's signature is still valid.
const signedTx = CSL.Transaction.new(unsignedTx.body(), witnessSet, unsignedTx.auxiliary_data())
```

## One more thing: submit through Blockfrost

CIP-30 wallets have a `submitTx()` function, but Lace's rejects its own signed transaction with `DeserialiseFailure: expected list len or indef`. So the server submits the finished transaction through Blockfrost instead. That has been reliable, and the error messages from the node are much clearer when something does go wrong.

The code is on [GitHub](https://github.com/Yadurshan-R/LankaNFT_Cardano). If you've built a Cardano app that supports both kinds of wallets, I'd like to know how you handled the signing step.
