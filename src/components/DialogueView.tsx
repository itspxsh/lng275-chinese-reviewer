'use client';
import {useMemo,useState} from 'react';
import {Volume2} from 'lucide-react';
import type {DialogueLine,Lesson} from '@/data/types';
import {speakMany} from '@/lib/speak';

type DialogueEntry=DialogueLine&{lessonId:number};
type Group={key:string;lessonId:number;section:string;pages:string[];lines:DialogueEntry[]};

export default function DialogueView({lesson,entries,speakText}:{lesson:Lesson;entries:DialogueEntry[];speakText:(text:string)=>void}){
 const [showPinyin,setShowPinyin]=useState(true);
 const [showThai,setShowThai]=useState(true);
 const groups=useMemo(()=>entries.reduce<Group[]>((result,line)=>{
  const section=line.section??'课文';
  const key=`${line.lessonId}:${section}`;
  let group=result.find(item=>item.key===key);
  if(!group){group={key,lessonId:line.lessonId,section,pages:[],lines:[]};result.push(group)}
  group.lines.push(line);
  if(line.bookPage&&!group.pages.includes(line.bookPage))group.pages.push(line.bookPage);
  return result;
 },[]),[entries]);
 const play=(lines:DialogueEntry[])=>{if(!speakMany(lines.map(line=>line.hanzi))&&lines[0])speakText(lines[0].hanzi)};
 return <div className="dialoguePage"><div className="pageTitle"><span className="tag">{lesson.id?`บทที่ ${lesson.id}`:'บทที่ 1–8'} · 课文</span><h1>บทสนทนาจากหนังสือ</h1></div>
  <div className="dialogueTools"><label><input type="checkbox" checked={showPinyin} onChange={event=>setShowPinyin(event.target.checked)}/> แสดงพินอิน</label><label><input type="checkbox" checked={showThai} onChange={event=>setShowThai(event.target.checked)}/> แสดงคำแปล</label><button onClick={()=>play(entries)}>อ่านบทสนทนาทั้งหมด</button></div>
  {groups.map(group=><section className="dialogueGroup" key={group.key}><div className="dialogueGroupTitle"><div><small>บท {group.lessonId}</small><h2 lang="zh-CN">{group.section}</h2></div><span>หนังสือหน้า {group.pages.join('、')}</span></div><div className="chatList">{group.lines.map((line,index)=><button className={`chatBubble ${index%2?'rightBubble':''}`} key={`${group.key}-${index}`} onClick={()=>speakText(line.hanzi)} aria-label={`ฟัง ${line.hanzi}`}><span className="speaker">{line.speaker}</span><span className="dialogueText"><b lang="zh-CN">{line.hanzi}</b>{showPinyin&&<small>{line.pinyin}</small>}{showThai&&<span lang="th">{line.th}</span>}</span><Volume2 size={18}/></button>)}</div><button className="smallAction dialoguePlay" onClick={()=>play(group.lines)}><Volume2 size={16}/> อ่านส่วนนี้ต่อเนื่อง</button></section>)}
 </div>
}
