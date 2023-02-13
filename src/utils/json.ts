import {wayback} from './wayback';

export const json = (url: string) => wayback(url).then((e) => e.json());
