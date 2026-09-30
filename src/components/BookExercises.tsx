'use client';
import {useMemo,useState} from 'react';
import {BookOpen,Check,Volume2} from 'lucide-react';
import {bookExercises} from '@/data/book-exercises';
import readingPhrases from '@/data/reading-phrases.json';
import {vocab} from '@/data/vocab';
import {extraVocab} from '@/data/extra';
import type {BookExerciseSection,BookExerciseQuestion,Lesson} from '@/data/types';
import StrokeBox from './StrokeBox';

const allWords=[...vocab,...extraVocab];
const isHanzi=(char:string)=>/[\u4e00-\u9fff]/u.test(char);
const unique=<T,>(items:T[])=>[...new Set(items)];
const stableNumber=(text:string)=>[...text].reduce((value,char)=>(value*31+char.charCodeAt(0))>>>0,7);
const toneOf=(pinyin:string)=>{const vowel=pinyin.match(/[āēīōūǖáéíóúǘǎěǐǒǔǚàèìòùǜ]/iu)?.[0]?.toLowerCase();if(!vowel)return 'เสียงเบา';if('āēīōūǖ'.includes(vowel))return 'เสียง 1';if('áéíóúǘ'.includes(vowel))return 'เสียง 2';if('ǎěǐǒǔǚ'.includes(vowel))return 'เสียง 3';return 'เสียง 4'};
const toneSeries=['āáǎà','ēéěè','īíǐì','ōóǒò','ūúǔù','ǖǘǚǜ'];
function toneVariants(pinyin:string){const match=pinyin.match(/[āēīōūǖáéíóúǘǎěǐǒǔǚàèìòùǜ]/iu);if(!match)return[];const vowel=match[0].toLowerCase();const series=toneSeries.find(item=>item.includes(vowel));return series?[...series].map(mark=>pinyin.replace(match[0],match[0]===vowel?mark:mark.toUpperCase())).filter(item=>item!==pinyin):[]}
function choicesFor(answer:string,pool:string[],id:string){const choices=unique([answer,...pool.filter(value=>value!==answer)]).slice(0,4);if(choices.length<2)return choices;const offset=stableNumber(id)%choices.length;return [...choices.slice(offset),...choices.slice(0,offset)]}

export default function BookExercises({lesson,speakText}:{lesson:Lesson;speakText:(text:string)=>void}){
 const sections=bookExercises.filter(section=>section.lessonId===lesson.id);
 const words=useMemo(()=>vocab.filter(word=>word.lessons.includes(lesson.id)&&word.category==='core'),[lesson.id]);
 const [selected,setSelected]=useState<Record<string,string>>({});
 const [activeStroke,setActiveStroke]=useState<Record<string,string>>({});
 const [showRetell,setShowRetell]=useState<Record<string,boolean>>({});
 const select=(key:string,value:string,spoken=value)=>{setSelected(current=>({...current,[key]:value}));speakText(spoken)};
 const matchingWord=(hanzi:string)=>allWords.find(word=>word.hanzi===hanzi);
 const pageLabel=(section:BookExerciseSection)=>section.bookPages.length===1?String(section.bookPages[0]):`${section.bookPages[0]}–${section.bookPages.at(-1)}`;

 function answerQuestion(section:BookExerciseSection,question:BookExerciseQuestion,index:number){
  const key=`${section.id}-q${index}`;
  return <article className="exerciseQuestion" key={key}>
   <button className="exercisePrompt" onClick={()=>speakText(question.hanzi)} aria-label={`ฟังคำถาม ${question.hanzi}`}><Volume2 size={18}/><span lang="zh-CN">{question.hanzi}</span></button>
   <small>{question.pinyin} · {question.th}</small>
   <button className="smallAction" onClick={()=>select(key,question.answerHanzi)}>ดูตัวอย่างคำตอบและฟังเสียง</button>
   {selected[key]&&<p className="exerciseAnswer"><Check size={16}/> ตัวอย่างคำตอบ: <span lang="zh-CN">{question.answerHanzi}</span> · {question.answerPinyin} · {question.answerTh}</p>}
  </article>
 }

 function completeDialogue(section:BookExerciseSection){
  const pairs=lesson.dialogue.flatMap((line,index)=>{const reply=lesson.dialogue[index+1];return reply&&line.speaker!==reply.speaker&&/[？?]/u.test(line.hanzi)?[{line,reply,index}]:[]}).slice(0,6);
  const pool=lesson.dialogue.map(line=>line.hanzi);
  return <div className="exerciseStack">{pairs.map(({line,reply,index})=>{
   const key=`${section.id}-line${index}`;
   return <article className="exerciseQuestion" key={key}>
    <button className="exercisePrompt" onClick={()=>speakText(line.hanzi)}><Volume2 size={18}/><span lang="zh-CN">{line.speaker}: {line.hanzi}</span></button>
    <small>{line.pinyin} · {line.th}</small>
    <p className="exerciseBlank">{reply.speaker}: ________</p>
    <div className="exerciseChoices">{choicesFor(reply.hanzi,pool,key).map(option=><button key={option} lang="zh-CN" className={selected[key]===option?(option===reply.hanzi?'correct':'incorrect'):''} onClick={()=>select(key,option)}>{option}</button>)}</div>
    {selected[key]&&<p className="exerciseAnswer">{selected[key]===reply.hanzi?'ถูกต้อง · ':'เฉลย · '}<span lang="zh-CN">{reply.hanzi}</span> · {reply.pinyin} · {reply.th}</p>}
   </article>
  })}</div>
 }

 function soundDrill(section:BookExerciseSection){
  if(section.kind==='tone-sandhi'){
   const rule=section.lessonId===3?{word:'不去',question:'不 อยู่หน้าเสียงสี่ ควรออกเสียงอย่างไร',answer:'bú qù',options:['bù qù','bú qù','bǔ qù','bū qù'],explain:'不 ก่อนเสียงสี่เปลี่ยนเสียงพูดเป็น bú'}:section.lessonId===2?{word:'很忙',question:'很 นำหน้า 忙 ควรออกเสียงแบบใด',answer:'เสียงสามครึ่งเสียง',options:['เสียงสามเต็ม','เสียงสามครึ่งเสียง','เสียงสอง','เสียงเบา'],explain:'เสียงสามที่นำหน้าเสียงอื่นมักออกเสียงสั้นลง แต่รูปพินอินยังเป็น hěn'}:{word:'你好',question:'เสียงสามสองตัวติดกัน พยางค์แรกออกเสียงใกล้เสียงใด',answer:'เสียง 2',options:['เสียง 1','เสียง 2','เสียง 3','เสียง 4'],explain:'3 + 3 ออกเสียงใกล้ 2 + 3 แม้ยังเขียน nǐ hǎo'};
   const key=`${section.id}-rule`;
   return <div className="exerciseQuestion"><button className="exercisePrompt" onClick={()=>speakText(rule.word)}><Volume2 size={18}/><span lang="zh-CN">{rule.word}</span></button><small>{rule.question}</small><div className="exerciseChoices">{rule.options.map(option=><button key={option} className={selected[key]===option?(option===rule.answer?'correct':'incorrect'):''} onClick={()=>select(key,option,rule.word)}>{option}</button>)}</div>{selected[key]&&<p className="exerciseAnswer">{selected[key]===rule.answer?'ถูกต้อง':'เฉลย: '+rule.answer} · {rule.explain}</p>}</div>
  }
  const focused=section.kind==='phonetics'&&lesson.id===2?words.filter(word=>['吗','爸爸','妈妈','弟弟','哥哥','妹妹'].includes(word.hanzi)):section.kind==='phonetics'&&lesson.id===4?words.filter(word=>word.hanzi.includes('儿')):[];
  const samples=section.kind==='tone'?words.filter(word=>[...word.hanzi].length===1).slice(0,10):focused.length?focused:words.filter(word=>word.pinyin).slice(0,8);
  const pool=unique([...words,...allWords].map(word=>word.pinyin)).filter(Boolean);
  return <><p className="exerciseHint">{section.kind==='tone'?'ฟังแล้วเลือกวรรณยุกต์ของพยางค์แรก จากนั้นตรวจพินอิน':section.kind==='phonetics'&&lesson.id===2?'ฟังเสียงเบาในคำ เช่น 妈妈 และเลือกพินอินที่พยางค์ท้ายไม่ใส่วรรณยุกต์':section.kind==='phonetics'&&lesson.id===4?'ฟังเสียง 儿化 แล้วเลือกพินอินที่ตรงกับคำ':'ฟังเสียงแล้วเลือกพินอินให้ตรงกับคำ ฝึกแยกเสียงต้น เสียงท้าย และวรรณยุกต์'}</p><div className="exerciseStack">{samples.map((word,index)=>{const key=`${section.id}-sound${index}`;const answer=section.kind==='tone'?toneOf(word.pinyin):word.pinyin;const near=pool.filter(value=>value!==word.pinyin&&Math.abs(value.length-word.pinyin.length)<=2);const alternatives=section.kind==='tone'?['เสียง 1','เสียง 2','เสียง 3','เสียง 4','เสียงเบา']:[...toneVariants(word.pinyin).slice(0,2),...near.filter(value=>value[0]?.toLowerCase()===word.pinyin[0]?.toLowerCase()),...near];const choices=choicesFor(answer,[...alternatives,...pool],key);return <article className="exerciseQuestion" key={key}><button className="exercisePrompt" onClick={()=>speakText(word.hanzi)}><Volume2 size={18}/><span lang="zh-CN">{word.hanzi}</span></button><small>{section.kind==='tone'?'พยางค์แรกเป็นเสียงอะไร':'เลือกพินอินที่ตรงกับเสียงที่ได้ยิน'}</small><div className="exerciseChoices">{choices.map(choice=><button key={choice} className={selected[key]===choice?(choice===answer?'correct':'incorrect'):''} onClick={()=>select(key,choice,word.hanzi)}>{choice}</button>)}</div>{selected[key]&&<p className="exerciseAnswer">{selected[key]===answer?'ถูกต้อง':'เฉลย: '+answer} · {word.pinyin} · {word.th}</p>}</article>})}</div></>
 }

 function readDrill(section:BookExerciseSection){
  const list=section.readingHanzi?.length?section.readingHanzi:words.slice(0,16).map(word=>word.hanzi);
  return <><p className="exerciseHint">แตะคำเพื่อฟังเสียง แล้วอ่านพินอินและคำแปลประกอบ</p><div className="exerciseWordGrid">{list.map((hanzi,index)=>{const word=matchingWord(hanzi);const phrase=readingPhrases[hanzi as keyof typeof readingPhrases];const key=`${section.id}-read${index}`;return <button key={key} onClick={()=>select(key,hanzi)} className={selected[key]?'selected':''}><b lang="zh-CN">{hanzi}</b>{selected[key]&&<span>{phrase?.pinyin??word?.pinyin}<br/>{phrase?.th??word?.th}</span>}</button>})}</div></>
 }

 function communication(section:BookExerciseSection){return <><p className="exerciseHint">ฝึกอ่านสลับบทบาทจาก课文ของบทนี้ แตะประโยคเพื่อฟังเสียงอ่าน</p><div className="exerciseDialogue">{lesson.dialogue.map((line,index)=><button key={`${section.id}-${index}`} onClick={()=>speakText(line.hanzi)}><span className="exerciseSpeaker">{line.speaker}</span><span><b lang="zh-CN">{line.hanzi}</b><small>{line.pinyin}</small><small>{line.th}</small></span><Volume2 size={17}/></button>)}</div></>}

 function write(section:BookExerciseSection){
  const chars=unique([...(section.bookChars??'')].filter(isHanzi));
  const char=activeStroke[section.id]??chars[0];
  return <><p className="exerciseHint">ตัวอักษรในหัวข้อฝึกเขียนของหนังสือ แตะตัวที่ต้องการดูหรือฝึกลากขีด</p><div className="exerciseCharGrid">{chars.map(value=><button key={value} className={char===value?'selected':''} lang="zh-CN" onClick={()=>{setActiveStroke(current=>({...current,[section.id]:value}));speakText(value)}}>{value}</button>)}</div>{char&&<div className="exerciseStroke"><StrokeBox key={`${section.id}-${char}`} char={char} size={180} mode="quiz"/><span>ลากตามขีดของ <b lang="zh-CN">{char}</b></span></div>}</>
 }

 function substitution(section:BookExerciseSection){
  const patterns=[
   {question:'你是哪国人？',prefix:'我是',suffix:'人。',options:['中国','美国','英国','德国','法国','日本']},
   {question:'你学习什么？',prefix:'我学习',suffix:'。',options:['汉语','英语','法语','德语','日语','西班牙语']},
   {question:'这是什么杂志？',prefix:'这是',suffix:'杂志。',options:['中文','英文','德文','法文','日文']},
   {question:'那是谁的书？',prefix:'那是',suffix:'的书。',options:['王老师','张老师','我朋友','他']}
  ];
  return <div className="exerciseStack">{patterns.map((pattern,index)=>{const key=`${section.id}-sub${index}`;return <article className="exerciseQuestion" key={key}><button className="exercisePrompt" onClick={()=>speakText(pattern.question)}><Volume2 size={18}/><span lang="zh-CN">{pattern.question}</span></button><div className="exerciseChoices">{pattern.options.map(option=><button key={option} className={selected[key]===option?'chosen':''} lang="zh-CN" onClick={()=>select(key,option,`${pattern.prefix}${option}${pattern.suffix}`)}>{option}</button>)}</div>{selected[key]&&<p className="exerciseAnswer" lang="zh-CN">{pattern.prefix}{selected[key]}{pattern.suffix}</p>}</article>})}</div>
 }

 function retell(section:BookExerciseSection){const passage=section.retell;if(!passage)return null;return <article className="exerciseRetell"><button className="exercisePrompt" onClick={()=>speakText(passage.hanzi)}><Volume2 size={18}/><span lang="zh-CN">{passage.hanzi}</span></button><button className="smallAction" onClick={()=>{setShowRetell(value=>({...value,[section.id]:!value[section.id]}));speakText(passage.hanzi)}}>{showRetell[section.id]?'ซ่อนพินอินและคำแปล':'ดูพินอินและคำแปล'}</button>{showRetell[section.id]&&<p>{passage.pinyin}<br/>{passage.th}</p>}</article>}

 function picture(section:BookExerciseSection){return <><p className="exerciseHint">ดูภาพแทนสิ่งของในหนังสือ แล้วแตะเพื่อฟังคำตอบ</p><div className="exercisePictureGrid">{section.pictures?.map((item,index)=>{const key=`${section.id}-pic${index}`;return <button key={key} className={selected[key]?'selected':''} onClick={()=>select(key,item.hanzi)}><span aria-hidden="true">{item.cue}</span><b lang="zh-CN">{selected[key]?item.hanzi:'แตะเพื่อดู'}</b>{selected[key]&&<small>{item.pinyin} · {item.th}</small>}{item.detail&&<small>{item.detail}</small>}</button>})}</div></>}

 function sectionBody(section:BookExerciseSection){
  if(['tone','tone-sandhi','sound','phonetics'].includes(section.kind))return soundDrill(section);
  if(section.kind==='read')return readDrill(section);
  if(section.kind==='answer')return <div className="exerciseStack">{section.questions?.map((question,index)=>answerQuestion(section,question,index))}</div>;
  if(section.kind==='complete')return completeDialogue(section);
  if(section.kind==='communication')return communication(section);
  if(section.kind==='write')return write(section);
  if(section.kind==='substitution')return substitution(section);
  if(section.kind==='retell')return retell(section);
  if(section.kind==='picture')return picture(section);
  return null;
 }

 return <div className="bookExercises"><div className="pageTitle"><span className="tag">บทที่ {lesson.id} · หนังสือ {lesson.bookPages}</span><h1>แบบฝึกหัดท้ายบท</h1></div><section className="exerciseIntro"><BookOpen size={21}/><div><b>ครบ {sections.length} หัวข้อในหนังสือ</b><p>เรียงตามหน้าหนังสือ โจทย์ฝึกบนเว็บใช้คำและบทสนทนาจากบทเดียวกัน ส่วนคำถามที่เปิดได้หลายคำตอบแสดงตัวอย่างคำตอบ</p></div></section><nav className="exerciseNav" aria-label="หัวข้อแบบฝึกหัด">{sections.map(section=><a href={`#${section.id}`} key={section.id}>{section.number}. {section.titleTh}</a>)}</nav>{sections.map(section=><section className="exerciseSection" id={section.id} key={section.id}><div className="exerciseHeading"><span className="exerciseNumber">{section.number}</span><div><h2>{section.titleTh}</h2><small lang="zh-CN">{section.titleZh}</small></div><span className="exercisePage">หนังสือหน้า {pageLabel(section)}</span></div>{sectionBody(section)}</section>)}</div>
}
