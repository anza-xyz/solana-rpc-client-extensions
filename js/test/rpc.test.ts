import test from 'ava';
import { Address } from '@solana/addresses';
import { createSolanaRpc } from '@solana/rpc';
import { getStakeActivation } from '../src';

test('live activating', async (t) => {
    const rpc = createSolanaRpc('https://api.testnet.solana.com');
    let stake = '25R5p1Qoe4BWW4ru7MQSNxxAzdiPN7zAunpCuF8q5iTz';
    let status = await getStakeActivation(rpc, stake as Address);
    t.is(status.status, 'activating');
});

test('live deactivating', async (t) => {
    const rpc = createSolanaRpc('https://api.testnet.solana.com');
    let stake = 'GRWZecXmdJxNFhLooH83TXfi5HaqGaXSqBUzMPCxX5jC';
    let status = await getStakeActivation(rpc, stake as Address);
    t.is(status.status, 'deactivating');
});
