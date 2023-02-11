import 'jest';

import {fetchCollectionSlug, fetchContractAddress, Network} from '../src';

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

    it('missing-token-id', async () => {
      await expect(
        fetchCollectionSlug({
          contractAddress: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
          network: Network.MATIC,
        })
      ).rejects.toMatchSnapshot();
    });

    describe('matic', () => {

      it('artisantspecial', async () => {
        await expect(
          fetchCollectionSlug({
            contractAddress: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
            network: Network.MATIC,
            tokenId: '113248483929477389204957219413891167927065839510717550429608723920230394365404',
          }),
        ).resolves.toBe('artisantspecial');
      });

      it('wandievents', async () => {
        await expect(
          fetchCollectionSlug({
            contractAddress: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
            network: Network.MATIC,
            tokenId: '94149156980946697317614428571944365609665181621202038530767030033582598931348',
            }),
        ).resolves.toBe('wandievents');
      });
    });
  });

  describe('fetchContractAddress', () => {
    it('boredapeyachtclub', async () => {
      expect(
        await fetchContractAddress({
          collectionSlug: 'boredapeyachtclub',
        })
      ).toBe('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d');
    });
    it('rumble-kong-league', async () => {
      expect(
        await fetchContractAddress({
          collectionSlug: 'rumble-kong-league',
        }),
      ).toBe('0xef0182dc0574cd5874494a120750fd222fdb909a');
    });
    it('renftlabs', async () => {
      expect(
        await fetchContractAddress({
          collectionSlug: 'renftlabs',
        }),
      ).toBe('0x0db8c099b426677f575d512874d45a767e9acc3c');
    });
  });
});

