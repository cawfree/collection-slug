import {fetchCollectionSlug, BOTTLENECK_MAX_CONCURRENT} from '../src';

const requestsPerMinute = (() => {
  let dt: Date[] = [];
  return () => {
    const now = Date.now();

    dt = [...dt, new Date(now)].filter(e => e.getTime() > now - (60 * 1000));

    return dt.length;
  };
})();

const requestSomethingWhichDoesNotExist = async () => {
  try {
    await fetchCollectionSlug({
      contractAddress: '0x00000000006c3852cbef3e08e8df289169ede582',
    });
  } catch (e) {
    const isAcceptableError = e instanceof Error
      && e.message === 'Unable to find an attempted archive url for "opensea.io/assets/ethereum/0x00000000006c3852cbef3e08e8df289169ede582/*".';

    if (!isAcceptableError) throw e;
  }
  return requestsPerMinute();
};

const requestRookies = async () => {
  await fetchCollectionSlug({
    contractAddress: '0x63f421b24cea6765b326753f6d4e558c21ea8f76',
  });
  return requestsPerMinute();
};

void (async () => {
  while (true) {
    try {
      const parallelRequests = BOTTLENECK_MAX_CONCURRENT;

      const results = await Promise.all(
        [
          ...[...Array(parallelRequests)].map(requestRookies),
          ...[...Array(parallelRequests)].map(requestSomethingWhichDoesNotExist),
        ],
      );

      const rpm = results[results.length - 1];

      console.log('rpm', rpm); // sustained ~110rpm
    } catch (e) {
      console.error(e);
      break;
    }
  }
  process.exitCode = 1;
})();
