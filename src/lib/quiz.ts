import type {Vocab} from '@/data/types';
import {normalizePinyin} from './pinyin';
function distance(a:string,b:string){const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let prev=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=old}}return row[b.length]}
export type VocabQuizMode='hanzi-pinyin'|'hanzi-th'|'th-hanzi';
const pinyinSyllables=(word:Vocab)=>normalizePinyin(word.pinyinNum??word.pinyin).replace(/[()]/g,' ').replace(/[^a-zv1-5\s]/g,' ').split(/\s+/).filter(Boolean);
const commonSuffix=(a:string,b:string)=>{let n=0;while(n<Math.min(a.length,b.length)&&a[a.length-1-n]===b[b.length-1-n])n++;return n};
const bigrams=(value:string)=>{const chars=[...value.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'')];return new Set(chars.slice(0,-1).map((char,i)=>char+chars[i+1]))};
function meaningDistance(a:string,b:string){const left=bigrams(a),right=bigrams(b);if(!left.size||!right.size)return 1;let common=0;for(const part of left)if(right.has(part))common++;return 1-common/(left.size+right.size-common)}
function distractorScore(target:Vocab,candidate:Vocab,mode:VocabQuizMode){
 const a=pinyinSyllables(target),b=pinyinSyllables(candidate);
 const baseA=a.map(syllable=>syllable.replace(/[1-5]/g,'')),baseB=b.map(syllable=>syllable.replace(/[1-5]/g,''));
 const pinyinDistance=distance(baseA.join(''),baseB.join(''))+Math.abs(a.length-b.length)*2;
 const samePinyinEnding=commonSuffix(baseA.at(-1)??'',baseB.at(-1)??'');
 const toneDifference=a.reduce((count,syllable,index)=>{const tone=syllable.match(/[1-5]/)?.[0],other=b[index]?.match(/[1-5]/)?.[0];return count+(tone&&other&&tone!==other?1:0)},0);
 const left=[...target.hanzi],right=[...candidate.hanzi];
 const commonChars=left.filter(char=>right.includes(char)).length;
 const sameLast=left.at(-1)===right.at(-1);
 const sameLength=left.length===right.length;
 if(mode==='hanzi-pinyin')return Math.abs(a.length-b.length)*5+pinyinDistance*.7-samePinyinEnding*1.8+toneDifference*.18;
 if(mode==='th-hanzi')return (sameLast?-5:0)+(sameLength?-2:Math.abs(left.length-right.length)*2)-commonChars*1.4+pinyinDistance*.45;
 const samePos=target.pos?.split(/[·(]/u)[0]===candidate.pos?.split(/[·(]/u)[0];
 return meaningDistance(target.th,candidate.th)*5+meaningDistance(target.en,candidate.en)*2+(samePos?-3:0)+(target.category===candidate.category?-1.5:0)+(sameLast?-1.5:0)+pinyinDistance*.25;
}
export function challengingVocabDistractors(target:Vocab,pool:Vocab[],mode:VocabQuizMode,label:(word:Vocab)=>string,limit=18){
 const seen=new Set([label(target)]);
 const ranked=pool.filter(word=>word.id!==target.id).map(word=>({word,score:distractorScore(target,word,mode)})).sort((a,b)=>a.score-b.score||a.word.id.localeCompare(b.word.id));
 const candidates:Vocab[]=[];
 for(const item of ranked){const key=label(item.word);if(!key||seen.has(key))continue;seen.add(key);candidates.push(item.word);if(candidates.length>=limit)break}
 return candidates;
}
export function sentenceTokens(sentence:string,words:Vocab[]){const text=sentence.replace(/[，。？！；：,.!?…\s]/gu,'');const lexicon=[...new Set(words.map(v=>v.hanzi).filter(word=>word&&word.length<text.length))].sort((a,b)=>b.length-a.length);const result:string[]=[];let i=0;while(i<text.length){const word=lexicon.find(candidate=>text.startsWith(candidate,i));if(word){result.push(word);i+=word.length;continue}let end=i+1;while(end<text.length&&!lexicon.some(candidate=>text.startsWith(candidate,end)))end++;result.push(text.slice(i,end));i=end}if(result.length===1&&[...text].length>1)return [...text];return result.length>1?result:[]}
export function shuffle<T>(items:T[]){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
