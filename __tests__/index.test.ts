import 'jest';

import { fetchCollectionSlug, Network } from '../src';

jest.setTimeout(60 * 1000);

/* Please do not consider any collections referenced here as an endorsement. */

describe('collection-slug', () => {
  it('jest', expect(true).toBeTruthy);

  describe('ethereum (default)', () => {
    it('boredapeyachtclub', async () => {
      expect(await fetchCollectionSlug({
        contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        network: Network.ETHEREUM,
      }))
        .toEqual('boredapeyachtclub');

      expect(await fetchCollectionSlug({
        contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
      }))
        .toEqual('boredapeyachtclub');
    });
    it('rumble-kong-league', async () => {
      expect(await fetchCollectionSlug({
        contractAddress: '0xef0182dc0574cd5874494a120750fd222fdb909a',
      }))
        .toEqual('rumble-kong-league');
    });
  });

  describe('matic', () => {
    it('layer3', async () => {
      expect(await fetchCollectionSlug({
        contractAddress: '0x200fb6e28edf0fbc9b5fabf7d39ae583981f5038',
        network: Network.MATIC,
      }))
        .toEqual('layer3');
    });
  });

  describe('arbitrum', () => {
    it('treasures-arbi', async () => {
      expect(await fetchCollectionSlug({
        contractAddress: '0xebba467ecb6b21239178033189ceae27ca12eadf',
        network: Network.ARBITRUM,
      }))
        .toEqual('treasures-arbi');
    });
  });

  describe('avalanche', () => {
    it('rich-peon-poor-peon', async () => {
      expect(await fetchCollectionSlug({
        contractAddress: '0x4c5a8b71330d751bf995472f3ab8ceb06a98dd47',
        network: Network.AVALANCHE,
      }))
        .toEqual('rich-peon-poor-peon');
    });
  });

  describe('optimism', () => {
    it('optimism-quests', async () => {
      expect(await fetchCollectionSlug({
        contractAddress: '0xfa14e1157f35e1dad95dc3f822a9d18c40e360e2',
        network: Network.OPTIMISM,
      }))
        .toEqual('optimism-quests');
    });
  });

  describe('openstore', () => {
    it('failure', async () => {
      await expect(fetchCollectionSlug({
        contractAddress: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
        network: Network.MATIC,
      })).rejects.toMatchSnapshot();
      await expect(fetchCollectionSlug({
        contractAddress: '0x2953399124f0cbb46d2cbacd8a89cf0599974963'.toUpperCase(),
        network: Network.MATIC,
      })).rejects.toMatchSnapshot();
    });
  });
});

