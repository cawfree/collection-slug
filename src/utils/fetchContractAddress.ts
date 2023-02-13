import {DEFAULT_REDUNDANCY} from '../constants';

import { fetchSnapshotUrls } from './fetchSnapshotUrls';
import { text } from './text';
import { winner } from './winner';

export async function fetchContractAddress({
  collectionSlug,
  redundancy = DEFAULT_REDUNDANCY,
}: {
  readonly collectionSlug: string;
  readonly redundancy?: number;
}) {
  const snapshotUrls = await fetchSnapshotUrls({
    cdxUri: `opensea.io/collection/${collectionSlug}`,
    redundancy,
  });

  for (const snapshotUrl of snapshotUrls) {
    try {
      const html = await text(snapshotUrl);
      const addresses = html.match(/(\b0x[a-f0-9]{40}\b)/g) || [];
      return winner(addresses);
    } catch {}
  }

  throw new Error('Unable to determine closest snapshot url.')
}
