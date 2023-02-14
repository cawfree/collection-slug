import type {Response} from 'node-fetch';

import {BOTTLENECK_WAYBACK_MACHINE} from '../constants';

import {fetchWithExponentialBackoff} from './fetchWithExponentialBackoff';

type PromiseCallback<T> = {
  readonly resolve: (result: T) => void;
  readonly reject: (error: unknown) => void;
};

type State = Record<string, readonly PromiseCallback<string>[]>;

export const wayback = (() => {

  const state: State = {};

  const popQueue = (key: string) => {
    const queue = state[key] || [];
    delete state[key];
    return queue;
  };

  const resolveQueue = async (key: string, result: Response) => {
    const text = await result.text();

    return popQueue(key)
      .forEach(({resolve}) => resolve(text))
  };

  const rejectQueue = (key: string, error: unknown) => popQueue(key)
    .forEach(({reject}) => reject(error));

  return async function WaybackFetch(url: string): Promise<string> {
    return new Promise<string>(
      (resolve, reject) => {
        const callback: PromiseCallback<string> = {resolve, reject};

        const queue = [...(state[url] || []), callback];

        Object.assign(state, {[url]: queue});

        if (queue.length > 1) return;

        return BOTTLENECK_WAYBACK_MACHINE.schedule(async () => {
          try {
            const result = await fetchWithExponentialBackoff(url);
            return resolveQueue(url, result);
          } catch (e) {
            return rejectQueue(url, e);
          }
        });

      },
    );
  }
})();

