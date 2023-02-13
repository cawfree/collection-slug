import fetch, {FetchError, Response} from 'node-fetch';

import {BACKOFF_MULTIPLIER, INITIAL_BACKOFF_TIME} from '../constants';

const retriableFetchErrors: readonly string[] = [
  'ENOTFOUND',
  'ECONNREFUSED',
  'ECONNRESET',
];

type State = {
  readonly delay: number;
  readonly initializedAt?: number;
};

const initialState = (): State => ({
  delay: 0,
});

const stateWithBackoff = (
  {delay, ...extras}: State,
  initialBackoffTime: number,
  backoffMultiplier: number,
): State => {
  if (!delay) return {delay: initialBackoffTime, initializedAt: Date.now()};

  return {...extras, delay: Math.ceil(delay * backoffMultiplier)};
};

const fetchWithExponentialBackoffThunk = (({
  initialBackoffTime,
  backoffMultiplier,
}: {
  readonly initialBackoffTime: number;
  readonly backoffMultiplier: number;
}) => {
  const state: State = initialState();

  const dispatch = (nextState: State): State => Object.assign(state, nextState);

  const maybeIncreaseBackoff = () =>
    dispatch(stateWithBackoff(state, initialBackoffTime, backoffMultiplier));

  const maybeResetBackoff = () => {
    const {initializedAt, delay} = state;

    const now = Date.now();

    const timeSinceInitialized = now - (initializedAt || 0);

    if (timeSinceInitialized > initialBackoffTime && delay) dispatch(initialState());
  };

  return async function fetchWithExponentialBackoff(url: string): Promise<Response> {
    const startedAt = Date.now();
    try {
      for (
        let now = startedAt, dt = now - startedAt;
        dt < state.delay;
        now = Date.now(), dt = now - startedAt
      ) {
        await new Promise(resolve => setTimeout(resolve, state.delay - dt));
      }

      const result = await fetch(url);

      if (result.status === 429) {
        maybeIncreaseBackoff();
        return fetchWithExponentialBackoff(url);
      }

      maybeResetBackoff();

      return result;
    } catch (e) {

      if (e instanceof FetchError && retriableFetchErrors.includes(String(e.errno))) {
        maybeIncreaseBackoff();
        return fetchWithExponentialBackoff(url);
      }

      throw e;
    }
  }
});

export const fetchWithExponentialBackoff = fetchWithExponentialBackoffThunk({
  initialBackoffTime: INITIAL_BACKOFF_TIME,
  backoffMultiplier: BACKOFF_MULTIPLIER,
});
