import { parse } from 'node-html-parser';

import { Network } from '../@types';
import {
  BASE_COLLECTION_URL,
  DEFAULT_REDUNDANCY,
  OPENSTORE_DEPLOYMENTS,
  WAYBACK_MACHINE_BOTTLENECK,
} from '../constants';

import { fetchSnapshotUrls } from './fetchSnapshotUrls';
import { text } from './text';
import { winner } from './winner';

export const fetchCollectionSlug = async ({
  contractAddress,
  network = Network.ETHEREUM,
  tokenId = undefined,
  redundancy = DEFAULT_REDUNDANCY,
}: {
  readonly contractAddress: string;
  readonly tokenId?: string;
  readonly network?: Network;
  readonly redundancy?: number;
}): Promise<string> => {

  const isOpenstoreDeployment = OPENSTORE_DEPLOYMENTS
    .find(
    (e) =>
      e.network === network && e.contractAddress.toLowerCase() === contractAddress.toLowerCase()
  );

  if (isOpenstoreDeployment && (!tokenId || !tokenId.length))
    throw new Error('To find the collectionSlug on the OPENSTORE contract, you must specify a tokenId.');

  const snapshotUrls = await fetchSnapshotUrls({
    cdxUri: `opensea.io/assets/${
      network
    }/${
      contractAddress
    }/${
      isOpenstoreDeployment ? String(tokenId) : '*'
    }`,
      redundancy,
  });

  for (const snapshotUrl of snapshotUrls) {
    try {
      const $ = parse(await WAYBACK_MACHINE_BOTTLENECK.schedule(() => text(snapshotUrl)));

      const slugs = $.getElementsByTagName('a')
        .map(e => e.attributes.href)
        .flatMap(e => e?.length ? [e] : [])
        .filter(e => e.includes(BASE_COLLECTION_URL))
        .map(e => e.substring(e.indexOf(BASE_COLLECTION_URL) + BASE_COLLECTION_URL.length).split('/')[0]?.split('?')[0])
        .flatMap(e => typeof e === 'string' ? [e] : []);

      return winner(slugs);
    } catch {}
  }

  throw new Error('Unable to determine closest snapshot url.');

};
