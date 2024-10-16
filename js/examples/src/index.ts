import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation';
import { Address } from '@solana/addresses';
import { createSolanaRpc } from '@solana/rpc';

(async () => {
  const rpc = createSolanaRpc('https://api.testnet.solana.com');
  let stake = '25R5p1Qoe4BWW4ru7MQSNxxAzdiPN7zAunpCuF8q5iTz';
  let status = await getStakeActivation(rpc, stake as Address);
  console.log(status);
})();
