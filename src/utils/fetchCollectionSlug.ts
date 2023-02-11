import { parse } from 'node-html-parser';

import { Network } from '../@types';
import {BASE_COLLECTION_URL, OPENSTORE_DEPLOYMENTS} from '../constants';

import { fetchSnapshotUrl } from './fetchSnapshotUrl';
import { text } from './text';

export const fetchCollectionSlug = async ({
  contractAddress,
  network = Network.ETHEREUM,
  redundancy = 3,
}: {
  readonly contractAddress: string;
  readonly network?: Network;
  readonly redundancy?: number;
}): Promise<string> => {

  const isOpenstoreDeployment = OPENSTORE_DEPLOYMENTS
    .find(
    (e) =>
      e.network === network && e.contractAddress.toLowerCase() === contractAddress.toLowerCase()
  );

  if (isOpenstoreDeployment)
    throw new Error('OPENSTORE collections are not yet supported.');

  const z = await fetchSnapshotUrl({
    cdxUri: `opensea.io/assets/${
      network
    }/${
      contractAddress
    }/*`,
    redundancy,
  });

  const $ = parse(await text(z));

  const slugs = $.getElementsByTagName('a')
    .map(e => e.attributes.href)
    .flatMap(e => e?.length ? [e] : [])
    .filter(e => e.includes(BASE_COLLECTION_URL))
    .map(e => e.substring(e.indexOf(BASE_COLLECTION_URL) + BASE_COLLECTION_URL.length).split('/')[0]?.split('?')[0])
    .flatMap(e => typeof e === 'string' ? [e] : []);

  const slugPoints = slugs.reduce<Record<string, number>>(
    (obj, slug) => {
      obj[slug] = (obj[slug] || 0) + 1;
      return obj;
    },
    {},
  );

  const maxScore = Math.max(...Object.values(slugPoints), 0);
  const winners = Object.entries(slugPoints).filter(([, score]) => score === maxScore);

  const [maybeWinner, ...maybeJustifiedWinners] = winners;

  if (maybeJustifiedWinners.length)
    throw new Error('Unable to conclusively resolve a specific collection slug.');

  if (!maybeWinner)
    throw new Error('Unable to determine collection slug.');

  return maybeWinner[0];
};
