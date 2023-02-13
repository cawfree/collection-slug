import {fetchCollectionSlug} from '../src';

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
  } catch {}
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
      const [,,,,,,, rpm] = await Promise.all([
        requestRookies(),
        requestSomethingWhichDoesNotExist(),
        requestRookies(),
        requestSomethingWhichDoesNotExist(),
        requestRookies(),
        requestSomethingWhichDoesNotExist(),
        requestRookies(),
        requestRookies(),
      ]);

      console.log(rpm); // sustained ~110rpm
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  }
})();
