# solana-get-stake-activation

Rust and JS code to perform Solana RPC's GetStakeActivation client-side

## Motivation

The `GetStakeActivation` RPC code is being removed in Agave 2.0, but users may
still need to get access to stake activation data.

The RPC method was removed because it's possible to get calculate the status of
a stake account on the client-side.

This repo contains Rust and JS code for mimicking `GetStakeActivation` on the
client-side. See the `examples/` in each repo to see how to use them, or read
the source code!
