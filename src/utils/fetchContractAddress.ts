import { DEFAULT_REDUNDANCY } from '../constants';

import { fetchSnapshotUrl } from './fetchSnapshotUrl';
import { text } from './text';
import { winner } from './winner';

export async function fetchContractAddress({
  collectionSlug,
  redundancy = DEFAULT_REDUNDANCY,
}: {
  readonly collectionSlug: string;
  readonly redundancy?: number;
}) {
  const z = await fetchSnapshotUrl({
    cdxUri: `opensea.io/collection/${collectionSlug}`,
    redundancy,
  });

  const html = await text(z);

  const addresses = html.match(/(\b0x[a-f0-9]{40}\b)/g) || [];

  return winner(addresses);
}
