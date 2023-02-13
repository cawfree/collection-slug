import {json} from './json';

export const fetchMaybeAvailableSnapshotUrl = async (maybeArchiveUrl: string): Promise<string | null> => {
  const maybeAvailability = await json(`https://archive.org/wayback/available?url=${maybeArchiveUrl}`);

  if (!maybeAvailability || typeof maybeAvailability !== 'object') return null;

  const available = maybeAvailability?.archived_snapshots?.closest?.available;

  if (!available) return null;

  return maybeAvailability?.archived_snapshots?.closest?.url || null;
};
