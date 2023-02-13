import {DEFAULT_REDUNDANCY} from '../constants';

import { fetchArchiveUrls } from './fetchArchiveUrls';
import { fetchMaybeAvailableSnapshotUrl } from './fetchMaybeAvailableSnapshotUrl';
import { text } from './text';
import { winner } from './winner';

export async function fetchContractAddress({
  collectionSlug,
  redundancy = DEFAULT_REDUNDANCY,
}: {
  readonly collectionSlug: string;
  readonly redundancy?: number;
}) {
  const archiveUrls = await fetchArchiveUrls({
    cdxUri: `opensea.io/collection/${collectionSlug}`,
    redundancy,
  });

  for (const archiveUrl of archiveUrls) {
    try {

      const maybeSnapshotUrl = await fetchMaybeAvailableSnapshotUrl(archiveUrl);

      if (!maybeSnapshotUrl) continue;

      const html = await text(maybeSnapshotUrl);
      const addresses = html.match(/(\b0x[a-f0-9]{40}\b)/g) || [];

      return winner(addresses);
    } catch {}
  }

  throw new Error('Unable to determine closest snapshot url.')
}
