import Bottleneck from 'bottleneck';

import {Deployment, Network} from '../@types';

export const BASE_COLLECTION_URL = 'https://opensea.io/collection/';

export const OPENSTORE_DEPLOYMENTS: readonly Deployment[] = [
  {
    contractAddress: '0x495f947276749ce646f68ac8c248420045cb7b5e',
    network: Network.ETHEREUM,
  },
  {
    contractAddress: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
    network: Network.MATIC,
  },
];

export const DEFAULT_REDUNDANCY = 1;
export const BOTTLENECK_MAX_CONCURRENT = 12;

// 12, 300 ~ 96rpm.

export const BOTTLENECK_WAYBACK_MACHINE = new Bottleneck({
  maxConcurrent: BOTTLENECK_MAX_CONCURRENT,
  minTime: 300,
});
