'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from './useInView';
export default function StrokeBox({char,size=170,mode='animate'}:{char:string;size?:number;mode?:'animate'|'quiz'}){
 const host=useRef<HTMLDivElement>(null);const visible=useInView(host);const [missing,setMissing]=useState(false);
 useEffect(()=>{if(!visible||!host.current)return;setMissing(false);let writer:{animateCharacter:()=>void;quiz:()=>void}|undefined;let disposed=false;
  const strokeChar=char.match(/[\u4e00-\u9fff]/u)?.[0];if(!strokeChar){setMissing(true);return}
  fetch(`/hanzi-data/${encodeURIComponent(strokeChar)}.json`).then(r=>r.ok?r.json():Promise.reject()).then(async data=>{if(disposed||!host.current)return;const mod=await import('hanzi-writer');if(disposed||!host.current)return;writer=mod.default.create(host.current,strokeChar,{width:size,height:size,padding:8,showOutline:true,strokeAnimationSpeed:1,delayBetweenStrokes:220,strokeColor:'#3b3733',outlineColor:'#eae1d6',radicalColor:'#d76b55',charDataLoader:(_c,onLoad)=>onLoad(data)});mode==='quiz'?writer.quiz():writer.animateCharacter()}).catch(()=>setMissing(true));return()=>{disposed=true;host.current?.replaceChildren()}
 },[char,size,mode,visible]);
 return <div className="strokeFrame" style={{width:size,height:size}} ref={host}>{missing&&<Fallback char={char}/>}</div>
}
function Fallback({char}:{char:string}){return <div className="strokeFallback"><span lang="zh-CN">{char}</span><small>ไม่มีข้อมูลลำดับขีดสำหรับตัวนี้</small></div>}
