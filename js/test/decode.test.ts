import test from 'ava';
import { stakeAccountCodec, stakeHistoryCodec } from '../src';

const data = new Uint8Array([
  1, 0, 0, 0, 128, 213, 34, 0, 0, 0, 0, 0, 133, 0, 79, 231, 141, 29, 73, 61,
  232, 35, 119, 124, 168, 12, 120, 216, 195, 29, 12, 166, 139, 28, 36, 182, 186,
  154, 246, 149, 224, 109, 52, 100, 133, 0, 79, 231, 141, 29, 73, 61, 232, 35,
  119, 124, 168, 12, 120, 216, 195, 29, 12, 166, 139, 28, 36, 182, 186, 154,
  246, 149, 224, 109, 52, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0,
]);

const stakeHistoryData = new Uint8Array([
  1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4, 0,
  0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0,
]);

test('decode stake', (t) => {
  // As long as we get the 4-byte enum and the first field right, then
  // we're sure the rest works out
  const unpacked = stakeAccountCodec.decode(data);
  t.is(unpacked.meta.rentExemptReserve, 2282880n);
});

test('decode stake history', (t) => {
  // As long as we get the 4-byte enum and the first field right, then
  // we're sure the rest works out
  const unpacked = stakeHistoryCodec.decode(stakeHistoryData);
  t.is(unpacked.length, 1);
  t.is(unpacked[0].epoch, 2n);
  t.is(unpacked[0].effective, 3n);
  t.is(unpacked[0].activating, 4n);
  t.is(unpacked[0].deactivating, 5n);
});
