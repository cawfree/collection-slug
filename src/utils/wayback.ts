import fetch from 'node-fetch';

import {BOTTLENECK_WAYBACK_MACHINE} from '../constants';

export const wayback = async (url: string) => {
  try {
    return await BOTTLENECK_WAYBACK_MACHINE.schedule(() => fetch(url))
  } catch (e) {
    throw e;
  }
};
