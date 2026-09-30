'use client';
import {Volume2} from 'lucide-react';
import bookNoteRows from '@/data/book-notes.json';
import supplementRows from '@/data/supplemental-grammar.json';
import {lessons} from '@/data/lessons';
import type {GrammarPoint,Lesson} from '@/data/types';

type Note=GrammarPoint&{lessonId:number};
const bookNotes=bookNoteRows as Note[];
const supplements=supplementRows as GrammarPoint[];
const relevantSupplements:Record<number,number[]>={1:[0,3],2:[0,1,3],3:[0,1,2],4:[1,2],5:[2,3],6:[2,3],7:[2,4],8:[2,4]};
const tips:Record<number,string>={
 1:'ลองออกเสียง 你好 ต่อเนื่อง จะได้ยินเสียงสามตัวแรกเปลี่ยนไปจากรูปเขียน',
 2:'เสียงเบาอย่างพยางค์ท้ายของ 妈妈 มักสั้นและไม่ใส่เครื่องหมายวรรณยุกต์',
 3:'ไม่ก่อนคำเสียงสี่อ่าน bú เช่น 不去 แต่รูปตัวจีนยังเขียน 不 เหมือนเดิม',
 4:'哪儿 เป็นคำเดียวในการพูด แม้จะเห็นอักษรสองตัว',
 5:'您 ใช้แสดงความสุภาพกับผู้ใหญ่หรือผู้ที่ต้องให้เกียรติ',
 6:'ชื่อจีนมักวางแซ่ก่อนชื่อ เช่น 张东 มี 张 เป็นแซ่',
 7:'一个 อ่าน yí ge เพราะเสียงเดิมของ 个 เป็นเสียงสี่',
 8:'一斤 คือครึ่งกิโลกรัมในโจทย์ซื้อผลไม้ของบทนี้'
};

function GrammarCard({point,speakText}:{point:GrammarPoint;speakText:(text:string)=>void}){
 const page=point.bookPages?.length?`หนังสือหน้า ${point.bookPages.join('、')}`:null;
 return <article className="grammarSourceCard">
  <div className="grammarSourceTop"><h3>{point.title}</h3>{page&&<span>{page}</span>}</div>
  <code>{point.pattern}</code>
  <p>{point.explainTh}</p>
  {point.examples.map((example,index)=><button className="grammarExample" key={`${example.hanzi}-${index}`} onClick={()=>speakText(example.hanzi)} aria-label={`ฟังตัวอย่าง ${example.hanzi}`}><Volume2 size={17}/><span><b lang="zh-CN">{example.hanzi}</b><small>{example.pinyin}</small><small>{example.th}</small></span></button>)}
 </article>
}

export default function GrammarView({lesson,speakText}:{lesson:Lesson;speakText:(text:string)=>void}){
 if(lesson.id===0)return <div className="grammarPage"><div className="pageTitle"><span className="tag">บทที่ 1–8</span><h1>เลือกบทไวยากรณ์</h1></div><nav className="grammarLessonLinks">{lessons.map(item=><a key={item.id} href={`/lesson/${item.id}/grammar`}>บท {item.id} · <span lang="zh-CN">{item.hanzi}</span></a>)}</nav></div>;
 const direct=[...bookNotes.filter(note=>note.lessonId===lesson.id),...lesson.grammar.filter(point=>point.source==='book-note')];
 const patterns=lesson.grammar.filter(point=>point.source==='dialogue-pattern'||!point.source);
 const extra=[...lesson.grammar.filter(point=>point.source==='supplement'),...(relevantSupplements[lesson.id]??[]).map(index=>supplements[index])];
 return <div className="grammarPage"><div className="pageTitle"><span className="tag">บทที่ {lesson.id} · {lesson.hanzi}</span><h1>ไวยากรณ์และข้อสังเกต</h1></div>
  <section className="grammarGroup"><div className="grammarGroupTitle"><h2>หมายเหตุจากหนังสือ</h2><span>ระบุหน้าอ้างอิง</span></div>{direct.map((point,index)=><GrammarCard point={point} speakText={speakText} key={`direct-${index}`}/>)}</section>
  <section className="grammarGroup"><div className="grammarGroupTitle"><h2>รูปประโยคจากบทสนทนา</h2><span>สรุปจาก课文</span></div>{patterns.map((point,index)=><GrammarCard point={point} speakText={speakText} key={`pattern-${index}`}/>)}</section>
  <section className="grammarGroup grammarSupplement"><div className="grammarGroupTitle"><h2>ความรู้เพิ่มเติม</h2><span>เสริมเพื่อทบทวนก่อนสอบ</span></div><p className="supplementNotice">ส่วนนี้เป็นคำอธิบายและตัวอย่างฝึกเพิ่ม แยกจากหมายเหตุที่หนังสือระบุไว้ในบท</p>{extra.map((point,index)=><GrammarCard point={point} speakText={speakText} key={`extra-${index}`}/>)}</section>
  <aside className="lessonTip">เกร็ดเล็กน้อย · {tips[lesson.id]}</aside>
 </div>
}
