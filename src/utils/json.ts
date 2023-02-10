import fetch from 'node-fetch';

export const json = (url: string) => fetch(url).then((e) => e.json());
