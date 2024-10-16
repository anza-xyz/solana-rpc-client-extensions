import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation';
import { PublicKey } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';

(async () => {
  const connection = new Connection('https://api.testnet.solana.com');
  let stake = new PublicKey('25R5p1Qoe4BWW4ru7MQSNxxAzdiPN7zAunpCuF8q5iTz');
  let status = await getStakeActivation(connection, stake);
  console.log(status);
})();
