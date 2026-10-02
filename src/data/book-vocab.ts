import {lessons} from './lessons';
import {vocab} from './vocab';
import type {Lesson,Vocab} from './types';

const byId=new Map(vocab.map(word=>[word.id,word]));
export const bookLessonById=new Map(lessons.flatMap(lesson=>lesson.vocabIds.map(id=>[id,lesson.id] as const)));

export function vocabForms(hanzi:string):string[]{
 const optionalPrefix=hanzi.match(/^（([^）]+)）(.+)$/u);
 if(optionalPrefix)return [`${optionalPrefix[1]}${optionalPrefix[2]}`,optionalPrefix[2]];
 const alternative=hanzi.match(/^(.+?)（([^）]+)）$/u);
 if(alternative)return [alternative[1],alternative[2]];
 return [hanzi];
}

export function bookVocabForLesson(lesson:Lesson):Vocab[]{
 if(lesson.id===0)return allBookVocab;
 return lesson.vocabIds.map(id=>{
  const word=byId.get(id);
  if(!word)throw new Error(`Missing textbook vocabulary: ${id}`);
  return word;
 });
}

const seen=new Set<string>();
export const allBookVocab:Vocab[]=lessons.flatMap(lesson=>bookVocabForLesson(lesson)).filter(word=>{
 if(seen.has(word.id))return false;
 seen.add(word.id);
 return true;
});
