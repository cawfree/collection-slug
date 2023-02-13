import { json } from './json';

const cdx = ({
  cdxUri,
  count,
}: {
  readonly cdxUri: string;
  readonly count: number;
}) =>
  `http://web.archive.org/cdx/search/cdx?url=${
    cdxUri
  }&limit=${
    count
  }&filter=mimetype:text/html&fl=original&output=json&status=200`;

export const fetchArchiveUrls = async ({
  redundancy,
  cdxUri,
}: {
  readonly redundancy: number;
  readonly cdxUri: string;
}): Promise<
  readonly string[]
> => {
  const data = await json(cdx({cdxUri, count: redundancy}));

  if (!Array.isArray(data))
    throw new Error(`Expected data array, encountered "${String(data)}".`);

  const [_, ...maybeArchiveUrls] = [...new Set(data.flatMap(e => e))];

  if (!maybeArchiveUrls.length)
    throw new Error(`Unable to find an attempted archive url for "${cdxUri}".`);

  return maybeArchiveUrls;
};
