import { Network } from '../@types';
import {
  BASE_COLLECTION_URL,
  DEFAULT_REDUNDANCY,
  OPENSTORE_DEPLOYMENTS,
} from '../constants';

import { fetchArchiveUrls } from './fetchArchiveUrls';
import { fetchMaybeAvailableSnapshotUrl } from './fetchMaybeAvailableSnapshotUrl';
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

  const archiveUrls = await fetchArchiveUrls({
    cdxUri: `opensea.io/assets/${
      network
    }/${
      contractAddress
    }/${
      isOpenstoreDeployment ? String(tokenId) : '*'
    }`,
    redundancy,
  });

  for (const archiveUrl of archiveUrls) {
    try {
      const maybeSnapshotUrl = await fetchMaybeAvailableSnapshotUrl(archiveUrl);

      if (!maybeSnapshotUrl) continue;

      const slugs = (
        (await text(maybeSnapshotUrl)).match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g) || []
      )
        .filter(e => e.includes(BASE_COLLECTION_URL))
        .map(e => e.substring(e.indexOf(BASE_COLLECTION_URL) + BASE_COLLECTION_URL.length).split('/')[0]?.split('?')[0])
        .flatMap(e => typeof e === 'string' ? [e] : []);

      return winner(slugs);
    } catch {}
  }

  throw new Error('Unable to determine closest snapshot url.');

};
