import {fetchCollectionSlug} from '../src';

const requestsPerMinute = (() => {
  let dt: Date[] = [];
  return () => {
    const now = Date.now();

    dt = [...dt, new Date(now)].filter(e => e.getTime() > now - (60 * 1000));

    return dt.length;
  };
})();

//const requestSomethingWhichDoesNotExist = async () => {
//  const contractAddress = `${Math.random()}`;
//  try {
//    await fetchCollectionSlug({
//      contractAddress,
//    });
//  } catch (e) {
//    const isAcceptableError = e instanceof Error
//      && e.message === `Unable to find an attempted archive url for "opensea.io/assets/ethereum/${contractAddress}/*".`;
//
//    if (!isAcceptableError) throw e;
//  }
//  return requestsPerMinute();
//};

const requestRookies = async () => {
  await fetchCollectionSlug({
    contractAddress: '0x63f421b24cea6765b326753f6d4e558c21ea8f76',
  });
  return requestsPerMinute();
};

void (async () => {
  while (true) {
    try {
      // 0.78796s for a single slug = 393.98s.
      const numberOfParallelRequests = 50;

      const now = Date.now();

      const results = await Promise.all(
        [
          ...[...Array(numberOfParallelRequests)].map(requestRookies),
          //...[...Array(numberOfParallelRequests)].map(requestSomethingWhichDoesNotExist),
        ],
      );

      const rpm = results[results.length - 1];

      const dt = Date.now() - now;
      const timePerRequest = (dt / numberOfParallelRequests) / 1000;

      console.log('rpm', rpm, 'dt', dt, 'timePerRequest', timePerRequest);
    } catch (e) {
      console.error(e);
      if (Math.random() < 0) break;
    }
  }
  process.exitCode = 1;
})();
