import test from 'ava';
import { getStakeActivatingAndDeactivating } from '../src';

export interface StakeHistoryEntry {
  epoch: bigint;
  effective: bigint;
  activating: bigint;
  deactivating: bigint;
}

const HUGE_NUM = 1_000_000_000_000_000n;

test('activating', (t) => {
  const targetEpoch = 11n;
  const stake = 10n;
  const delegation = {
    stake,
    activationEpoch: targetEpoch,
    deactivationEpoch: HUGE_NUM,
    unused: 0n,
    voterPubkey: new Uint8Array(),
  };
  const stakeHistory = [
    {
      epoch: targetEpoch - 1n,
      effective: HUGE_NUM,
      activating: HUGE_NUM,
      deactivating: HUGE_NUM,
    },
  ];
  const status = getStakeActivatingAndDeactivating(
    delegation,
    targetEpoch,
    stakeHistory
  );
  t.is(status.activating, stake);
  t.is(status.effective, 0n);
  t.is(status.deactivating, 0n);
});
test('effective', (t) => {
  const targetEpoch = 11n;
  const stake = 10n;
  const delegation = {
    stake,
    activationEpoch: targetEpoch - 1n,
    deactivationEpoch: HUGE_NUM,
    unused: 0n,
    voterPubkey: new Uint8Array(),
  };
  const stakeHistory = [
    {
      epoch: targetEpoch - 1n,
      effective: HUGE_NUM,
      activating: stake,
      deactivating: HUGE_NUM,
    },
  ];
  const status = getStakeActivatingAndDeactivating(
    delegation,
    targetEpoch,
    stakeHistory
  );
  t.is(status.activating, 0n);
  t.is(status.effective, stake);
  t.is(status.deactivating, 0n);
});
test('deactivating', (t) => {
  const targetEpoch = 11n;
  const stake = 10n;
  const delegation = {
    stake,
    activationEpoch: targetEpoch - 1n,
    deactivationEpoch: targetEpoch,
    unused: 0n,
    voterPubkey: new Uint8Array(),
  };
  const stakeHistory = [
    {
      epoch: targetEpoch - 1n,
      effective: HUGE_NUM,
      activating: stake,
      deactivating: stake,
    },
  ];
  const status = getStakeActivatingAndDeactivating(
    delegation,
    targetEpoch,
    stakeHistory
  );
  t.is(status.activating, 0n);
  t.is(status.effective, stake);
  t.is(status.deactivating, stake);
});
test('multi-epoch activation', (t) => {
  const targetEpoch = 11n;
  const stake = HUGE_NUM;
  const delegation = {
    stake,
    activationEpoch: targetEpoch - 1n,
    deactivationEpoch: HUGE_NUM,
    unused: 0n,
    voterPubkey: new Uint8Array(),
  };
  const stakeHistory = [
    {
      epoch: targetEpoch - 1n,
      effective: HUGE_NUM,
      activating: HUGE_NUM,
      deactivating: HUGE_NUM,
    },
  ];
  const status = getStakeActivatingAndDeactivating(
    delegation,
    targetEpoch,
    stakeHistory
  );
  // all of the total amount activating, but only 9% allowed, so it'll activate 9%
  const effective = (stake * 9n) / 100n;
  t.is(status.activating, stake - effective);
  t.is(status.effective, effective);
  t.is(status.deactivating, 0n);
});
test('multi-epoch deactivation', (t) => {
  const targetEpoch = 11n;
  const stake = HUGE_NUM;
  const delegation = {
    stake,
    activationEpoch: targetEpoch - 2n,
    deactivationEpoch: targetEpoch - 1n,
    unused: 0n,
    voterPubkey: new Uint8Array(),
  };
  const stakeHistory = [
    {
      epoch: targetEpoch - 2n,
      effective: HUGE_NUM * 100n, // make sure it all activates in one epoch
      activating: stake,
      deactivating: stake,
    },
    {
      epoch: targetEpoch - 1n,
      effective: HUGE_NUM,
      activating: HUGE_NUM,
      deactivating: HUGE_NUM,
    },
  ];
  const status = getStakeActivatingAndDeactivating(
    delegation,
    targetEpoch,
    stakeHistory
  );
  // all of the total amount deactivating, but only 9% allowed, so it'll deactivate 9%
  const deactivated = (stake * 9n) / 100n;
  t.is(status.activating, 0n);
  t.is(status.effective, stake - deactivated);
  t.is(status.deactivating, stake - deactivated);
});
