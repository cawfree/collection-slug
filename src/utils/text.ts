import {wayback} from './wayback';

export const text = (url: string) => wayback(url).then((e) => e.text());
