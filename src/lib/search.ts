import type {Vocab} from '@/data/types';
import {normalizePinyin} from './pinyin';
export function searchVocab(items:Vocab[],query:string){const q=normalizePinyin(query);if(!q)return items;return items.filter(v=>normalizePinyin(`${v.hanzi} ${v.pinyin} ${v.pinyinNum??''} ${v.th} ${v.en}`).includes(q))}
