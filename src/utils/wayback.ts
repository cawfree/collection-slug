import type {Response} from 'node-fetch';

import {BOTTLENECK_WAYBACK_MACHINE} from '../constants';

import {fetchWithExponentialBackoff} from './fetchWithExponentialBackoff';

export const wayback = async (
  url: string,
): Promise<Response> => {
  return BOTTLENECK_WAYBACK_MACHINE.schedule(() => fetchWithExponentialBackoff(url));
};
