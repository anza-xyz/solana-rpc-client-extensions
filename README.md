# solana-rpc-client-extensions

Rust and JS code to perform Solana RPC calls on the client-side. Currently
covers the following RPC calls and packages:

| RPC Call | Rust Package | JS Package | JS v1 Package |
| --- | --- | --- | --- |
| `GetStakeActivation` | `solana-rpc-get-stake-activation` | `@anza-xyz/solana-rpc-get-stake-activation` | `@anza-xyz/solana-rpc-get-stake-activation-v1` |

## Motivation

The `GetStakeActivation` RPC code is being removed in Agave 2.0, but users may
still need to get access to stake activation data.

The RPC method was removed because it's possible to get calculate the status of
a stake account on the client-side.

This repo contains Rust and JS code for mimicking `GetStakeActivation` on the
client-side. See the `examples/` in each repo to see how to use them, or read
the source code!
