import type {Network} from '../@types';
import {OPENSTORE_DEPLOYMENTS} from '../constants';

export const isOpenStoreDeployment = (contractAddress: string, network: Network) => Boolean(
  OPENSTORE_DEPLOYMENTS
    .find(
      (e) =>
          e.network === network && e.contractAddress.toLowerCase() === contractAddress.toLowerCase()
    ),
);
