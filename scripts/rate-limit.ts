import {fetchCollectionSlug} from '../src';

const requestsPerMinute = (() => {
  let dt: Date[] = [];
  return () => {
    const now = Date.now();

    dt = [...dt, new Date(now)].filter(e => e.getTime() > now - (60 * 1000));

    return dt.length;
  };
})();

const requestRookies = async () => {
  await fetchCollectionSlug({
    contractAddress: '0x63f421b24cea6765b326753f6d4e558c21ea8f76',
  });
  return requestsPerMinute();
};

void (async () => {
  while (true) {
    try {
      const [,,,,,,, rpm] = await Promise.all([
        requestRookies(),
        requestRookies(),
        requestRookies(),
        requestRookies(),
        requestRookies(),
        requestRookies(),
        requestRookies(),
        requestRookies(),
      ]);

      console.log(rpm); // sustained ~150rpm
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  }
})();
