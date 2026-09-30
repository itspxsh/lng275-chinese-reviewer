export type VocabCategory = 'core' | 'phrase' | 'context' | 'extra';
export interface Vocab { id:string; hanzi:string; pinyin:string; pinyinNum?:string; th:string; en:string; pos?:string; category:VocabCategory; lessons:number[]; bookPage?:string; pdfPage?:string }
export interface DialogueLine { speaker:string; hanzi:string; pinyin:string; th:string; bookPage?:string; section?:string }
export interface GrammarPoint { title:string; pattern:string; explainTh:string; examples:{hanzi:string;pinyin:string;th:string}[]; bookPages?:number[]; source?:'book-note'|'dialogue-pattern'|'supplement' }
export interface Lesson { id:number; hanzi:string; pinyin:string; th:string; bookPages:string; topics:string[]; vocabIds:string[]; dialogue:DialogueLine[]; grammar:GrammarPoint[] }
export interface PhoneticsTopic { unit:'P1'|'P2'|'P3'; title:string; display:string; summaryTh:string; examples:string[]; quiz:{id:string;question:string;choices:string[];answerIndex:number;explainTh:string}[] }
export type BookExerciseKind='tone'|'tone-sandhi'|'sound'|'phonetics'|'read'|'answer'|'complete'|'communication'|'write'|'substitution'|'retell'|'picture';
export interface BookExerciseQuestion {hanzi:string;pinyin:string;th:string;answerHanzi:string;answerPinyin:string;answerTh:string}
export interface BookExercisePicture {cue:string;hanzi:string;pinyin:string;th:string;detail?:string}
export interface BookExerciseSection {id:string;lessonId:number;number:number;kind:BookExerciseKind;titleZh:string;titleTh:string;bookPages:number[];bookChars?:string;readingHanzi?:string[];questions?:BookExerciseQuestion[];retell?:{hanzi:string;pinyin:string;th:string};pictures?:BookExercisePicture[];instructionTh?:string}
