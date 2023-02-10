# `collection-slug`
🧸 🤖 Determine the collection slug for a collection on [__OpenSea__](https://opensea.io).

At the time of writing, the [__OpenSea API__](https://docs.opensea.io/reference/api-overview):
- does not serve information about layer twos like [__Arbitrum__](https://arbitrum.io/) and [__Optimism__](https://www.optimism.io/)
- will prevent you from querying for collection data when only knowing the `contractAddress` and not a corresponding `tokenId`
- relies upon a centrally-planned api key distribution system which restricts access to intrepid explorers
- shrewdly prevents you from querying GraphQL using the now deprecated [`opensea-submarine`](https://github.com/cawfree/opensea-submarine)⚠️
- will throttle you to oblivion if you exceed 4 req/s and your backoff period will increase quadratically as a penalty for repeat offenders
- protected their webpages against scrapers by firewalling requests behind [__CloudFlare__](https://www.cloudflare.com/en-gb/) and DOM obfuscation

And yet, everyone who works with [__NFTs__](https://ethereum.org/en/nft/) all need `collection_slug`s, desperately, every one of us. We need `collection_slug`s like fish need water. 🐟

I was researching how to bypass these limitations and encountered [__an article__](https://scrapeops.io/web-scraping-playbook/how-to-bypass-cloudflare/) that suggested we could work around such access restrictions by using archived copies of webpages... So here we are. OpenSea collection slugs, powered by the [__Wayback Machine__](https://web.archive.org/). They're surprisingly timely, even for newly trending collections. Let's go.

### getting started 🚀

You can install using [__Yarn__](https://yarnpkg.com):

```shell
yarn add node-html-parser collection-slug
```

Depending on your runtime, you'll need to ensure some kind of variation of [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is globally available. This is polyfilled onto the `window` object by default on browsers and [__React Native__](https://reactnative.dev), whereas on [__Node.js__](https://nodejs.org/en/) you'll need to install [`node-fetch`](https://www.npmjs.com/package/node-fetch).

```typescript
import { fetchCollectionSlug, Network } from 'collection-slug';

void (async () => {
  try {
    const collectionSlug: string = await fetchCollectionSlug({
      contractAddress: '0xef0182dc0574cd5874494a120750fd222fdb909a',
      network: Network.ETHEREUM /* default */,
    });
    
    console.log(collectionSlug); // 'rumble-kong-league'
  } catch (e) {
    console.error(e); // not indexed by the wayback machine
    process.exitCode = 1;
  }
})();
```

From my [__experimentation__](scripts/rate-limit.ts), it looks like these queries we're making aren't subject to throttling by the Wayback Machine. I managed to test a sustained ~150 requests-per-minute before I started feeling like an asshole abusing this wonderful shared resource.

### license ✌️
[__CC0-1.0__](./LICENSE)
