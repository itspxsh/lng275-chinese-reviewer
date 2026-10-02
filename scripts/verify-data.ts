import { readFileSync,existsSync } from 'node:fs';
const read=<T>(p:string)=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8')) as T;
type V={id:string;hanzi:string;pinyin:string;pinyinNum?:string;th:string;en:string;lessons:number[];bookPage?:string;pdfPage?:string};
const words=read<V[]>('../src/data/vocab.json');const lessons=read<{id:number;vocabIds:string[];dialogue:{hanzi:string;pinyin:string;th:string;bookPage?:string;section?:string}[];grammar:{source?:string;bookPages?:number[]}[]}[]>('../src/data/lessons.json');
const errors:string[]=[];if(words.length!==208)errors.push(`expected 208 source vocabulary records, received ${words.length}`);
const ids=new Set<string>();for(const w of words){if(ids.has(w.id))errors.push(`duplicate id ${w.id}`);ids.add(w.id);for(const k of ['hanzi','pinyin','th','en'] as const)if(!w[k]?.trim())errors.push(`${w.id} missing ${k}`);if(w.lessons.some(n=>n<1||n>8))errors.push(`${w.id} has a lesson outside 1–8`)}
const bookCounts=[12,15,23,22,17,32,23,26];const bookIds=new Set<string>();const bookHanzi=new Set<string>();
for(const l of lessons){
 if(l.vocabIds.length!==bookCounts[l.id-1])errors.push(`lesson ${l.id} New Words count is ${l.vocabIds.length}`);
 for(const id of l.vocabIds){
  const word=words.find(item=>item.id===id);
  if(!word){errors.push(`lesson ${l.id} references missing vocab ${id}`);continue}
  if(bookIds.has(id)||bookHanzi.has(word.hanzi))errors.push(`duplicate textbook word ${word.hanzi} in lesson ${l.id}`);
  bookIds.add(id);bookHanzi.add(word.hanzi);
  if(id!=='v205'&&(!word.bookPage||!word.pdfPage))errors.push(`${id} lacks its New Words page`);
 }
}
if(bookIds.size!==170)errors.push(`expected 170 ordered review entries, received ${bookIds.size}`);
type Section={id:string;lessonId:number;number:number;kind:string;titleZh:string;titleTh:string;bookPages:number[];bookChars?:string;readingHanzi?:string[];questions?:{hanzi:string;pinyin:string;th:string;answerHanzi:string;answerPinyin:string;answerTh:string}[];retell?:{hanzi:string;pinyin:string;th:string};pictures?:{cue:string;hanzi:string;pinyin:string;th:string}[]};
const sections=read<Section[]>('../src/data/book-exercises.json');
const readingPhrases=read<Record<string,{pinyin:string;th:string}>>('../src/data/reading-phrases.json');
const counts=[6,9,7,7,7,7,8,5];const sectionIds=new Set<string>();
if(sections.length!==56)errors.push(`expected 56 textbook exercise sections, received ${sections.length}`);
for(const l of lessons){
 const part=sections.filter(section=>section.lessonId===l.id);
 if(part.length!==counts[l.id-1])errors.push(`lesson ${l.id} exercise section count is ${part.length}`);
 for(let i=0;i<part.length;i++)if(part[i].number!==i+1)errors.push(`lesson ${l.id} has an out-of-order exercise number`);
 for(const line of l.dialogue)if(!line.hanzi||!line.pinyin||!line.th||!line.bookPage||!line.section)errors.push(`lesson ${l.id} dialogue lacks book source or translation`);
 for(const point of l.grammar)if(!point.source)errors.push(`lesson ${l.id} grammar lacks source classification`);
}
const kinds=new Set(['tone','tone-sandhi','sound','phonetics','read','answer','complete','communication','write','substitution','retell','picture']);
for(const section of sections){
 if(sectionIds.has(section.id))errors.push(`duplicate exercise id ${section.id}`);sectionIds.add(section.id);
 if(!kinds.has(section.kind))errors.push(`${section.id} has unsupported exercise kind`);
 if(!section.titleZh||!section.titleTh||!section.bookPages.length)errors.push(`${section.id} lacks title or book page`);
 if(section.kind==='write'&&!section.bookChars)errors.push(`${section.id} lacks writing characters`);
 if(section.kind==='answer'&&!section.questions?.length)errors.push(`${section.id} lacks source questions`);
 if(section.kind==='retell'&&!section.retell)errors.push(`${section.id} lacks source passage`);
 if(section.kind==='picture'&&!section.pictures?.length)errors.push(`${section.id} lacks picture cues`);
 for(const phrase of section.readingHanzi??[])if(!words.some(word=>word.hanzi===phrase)&&!readingPhrases[phrase])errors.push(`${section.id} reading phrase ${phrase} lacks pinyin and Thai`);
}
const notes=read<{lessonId:number;bookPages:number[];source:string}[]>('../src/data/book-notes.json');
const supplements=read<{source:string;bookPages?:number[]}[]>('../src/data/supplemental-grammar.json');
for(const note of notes)if(note.source!=='book-note'||!note.bookPages.length)errors.push(`book note in lesson ${note.lessonId} has missing source page`);
for(const item of supplements)if(item.source!=='supplement'||item.bookPages?.length)errors.push('supplement grammar is mislabeled as textbook content');
const chars=new Set(words.flatMap(w=>[...w.hanzi].filter(c=>/[\u4e00-\u9fff]/u.test(c))));const missing=existsSync(new URL('../public/hanzi-data/_missing.json',import.meta.url))?new Set<string>(read<string[]>('../public/hanzi-data/_missing.json')):new Set<string>();const noFile=[...chars].filter(c=>!existsSync(new URL(`../public/hanzi-data/${c}.json`,import.meta.url))&&!missing.has(c));if(noFile.length)errors.push(`stroke data has neither file nor missing-list entry: ${noFile.join('')}`);
const phonetics=read<{unit:string;quiz:{id:string;choices:string[];answerIndex:number}[]}[]>('../src/data/phonetics.json');if(phonetics.length!==23)errors.push(`expected 23 phonetics topics, received ${phonetics.length}`);if(phonetics.reduce((n,p)=>n+p.quiz.length,0)!==31)errors.push('phonetics quiz count must be 31');for(const p of phonetics)for(const q of p.quiz)if(q.answerIndex<0||q.answerIndex>=q.choices.length)errors.push(`invalid answer index in ${q.id}`);
const extras=read<V[]>('../src/data/extra.json');if(extras.length!==14)errors.push(`expected 14 distinct image extras, received ${extras.length}`);if(words.some(w=>!w.pinyinNum))errors.push('one or more main vocabulary records lack numbered pinyin');
const allSourceChars=new Set([...JSON.stringify([words,extras,lessons,sections,readingPhrases,notes,supplements,phonetics])].filter(c=>/[\u4e00-\u9fff]/u.test(c)));
const missingSourceStroke=[...allSourceChars].filter(c=>!existsSync(new URL(`../public/hanzi-data/${c}.json`,import.meta.url)));
if(missingSourceStroke.length)errors.push(`source Hanzi without local stroke data: ${missingSourceStroke.join('')}`);
console.log(`Vocabulary: ${words.length}; lessons: ${lessons.length}; dialogues: ${lessons.reduce((n,l)=>n+l.dialogue.length,0)}; textbook exercise sections: ${sections.length}; phonetics: ${phonetics.length} topics / 31 questions; extras: ${extras.length}; unique Hanzi: ${allSourceChars.size}; explicit stroke misses: ${missing.size}`);if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log('Data verification passed.');
