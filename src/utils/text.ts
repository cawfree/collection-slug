import fetch from 'node-fetch';

export const text = (url: string) => fetch(url).then((e) => e.text());
