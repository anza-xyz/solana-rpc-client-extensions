import {
  AccountInfo,
  ParsedAccountData,
  RpcResponseAndContext,
} from '@solana/web3.js';

export type StakeHistoryEntry = {
  epoch: bigint;
  effective: bigint;
  activating: bigint;
  deactivating: bigint;
};

export type Delegation = {
  voterPubkey: Uint8Array;
  stake: bigint;
  activationEpoch: bigint;
  deactivationEpoch: bigint;
};

export type StakeAccount = {
  discriminant: bigint;
  meta: {
    rentExemptReserve: bigint;
    authorized: {
      staker: Uint8Array;
      withdrawer: Uint8Array;
    };
    lockup: {
      unixTimestamp: bigint;
      epoch: bigint;
      custodian: Uint8Array;
    };
  };
  stake: {
    delegation: Delegation;
    creditsObserved: bigint;
  } | null;
};

type StakeHistoryEntryRaw = {
  epoch: number;
  stakeHistory: {
    effective: number;
    activating: number;
    deactivating: number;
  };
};

export const getStakeHistory = function (
  parsedData: RpcResponseAndContext<AccountInfo<
    ParsedAccountData | Buffer
  > | null>
): StakeHistoryEntry[] {
  if (parsedData.value === null || parsedData.value.data instanceof Buffer) {
    throw new Error('Account not found');
  }

  const stakeHistory: StakeHistoryEntry[] = [];

  parsedData.value.data.parsed.info.forEach((entry: StakeHistoryEntryRaw) => {
    stakeHistory.push({
      epoch: BigInt(entry.epoch),
      effective: BigInt(entry.stakeHistory.effective),
      activating: BigInt(entry.stakeHistory.activating),
      deactivating: BigInt(entry.stakeHistory.deactivating),
    });
  });

  return stakeHistory;
};

export const getStakeAccount = function (
  parsedData: RpcResponseAndContext<AccountInfo<
    ParsedAccountData | Buffer
  > | null>
): StakeAccount {
  if (parsedData.value === null || parsedData.value.data instanceof Buffer) {
    throw new Error('Account not found');
  }

  let discriminant = BigInt(0);
  if (parsedData.value.data.parsed.type === 'initialized') {
    discriminant = BigInt(1);
  } else if (parsedData.value.data.parsed.type === 'delegated') {
    discriminant = BigInt(2);
  }

  return {
    discriminant: discriminant,
    meta: {
      rentExemptReserve: BigInt(
        parsedData.value.data.parsed.info.meta.rentExemptReserve
      ),
      authorized: {
        staker: parsedData.value.data.parsed.info.meta.authorized.staker,
        withdrawer:
          parsedData.value.data.parsed.info.meta.authorized.withdrawer,
      },
      lockup: {
        unixTimestamp: BigInt(
          parsedData.value.data.parsed.info.meta.lockup.unixTimestamp
        ),
        epoch: BigInt(parsedData.value.data.parsed.info.meta.lockup.epoch),
        custodian: parsedData.value.data.parsed.info.meta.lockup.custodian,
      },
    },
    stake: parsedData.value.data.parsed.info.stake
      ? {
          delegation: {
            voterPubkey:
              parsedData.value.data.parsed.info.stake.delegation.voterPubkey,
            stake: BigInt(
              parsedData.value.data.parsed.info.stake.delegation.stake
            ),
            activationEpoch: BigInt(
              parsedData.value.data.parsed.info.stake.delegation.activationEpoch
            ),
            deactivationEpoch: BigInt(
              parsedData.value.data.parsed.info.stake.delegation
                .deactivationEpoch
            ),
          },
          creditsObserved: BigInt(
            parsedData.value.data.parsed.info.stake.creditsObserved
          ),
        }
      : null,
  };
};
