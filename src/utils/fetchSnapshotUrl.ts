import { json } from './json';

const cdx = (roughUrl: string) =>
  `http://web.archive.org/cdx/search/cdx?url=${roughUrl}&limit=1&filter=mimetype:text/html&fl=original&output=json`;

export const fetchSnapshotUrl = async (roughUrl: string) => {
  const data = await json(cdx(roughUrl));

  if (!Array.isArray(data))
    throw new Error(`Expected data array, encountered "${String(data)}".`);

  const maybeArchiveUrl = data?.[1]?.[0];

  if (typeof maybeArchiveUrl !== 'string' || !maybeArchiveUrl.length)
    throw new Error(`Unable to find an attempted archive url for "${
      roughUrl
    }".`);

  const availability = await json(`https://archive.org/wayback/available?url=${maybeArchiveUrl}`);

  if (typeof availability !== 'object' || !availability)
    throw new Error(`Unable to determine availability for archiveUrl "${maybeArchiveUrl}".`);

  const maybeClosestSnapshotUrl = availability?.archived_snapshots?.closest?.url;

  if (typeof maybeClosestSnapshotUrl !== 'string' || !maybeClosestSnapshotUrl.length)
    throw new Error(`Unable to determine closest snapshot url in: ${
      JSON.stringify(availability)
    }`);

  return maybeClosestSnapshotUrl;
};
