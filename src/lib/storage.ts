'use client';
import { useEffect, useState } from 'react';
export type StudyState = { known:Record<string,'known'|'unknown'>; quizWrong:string[]; settings:{showPinyin:boolean;showMeaning:boolean;scope:'core'|'all';shuffle:boolean}; examChecklist:Record<string,boolean> };
const initial:StudyState={known:{},quizWrong:[],settings:{showPinyin:true,showMeaning:true,scope:'core',shuffle:false},examChecklist:{}};
export function useStudyState(){
 const [state,setState]=useState<StudyState>(initial); const [ready,setReady]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem('lng275:v1');if(raw){const parsed=JSON.parse(raw);setState({...initial,...parsed,settings:{...initial.settings,...parsed.settings}})}}catch{} setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem('lng275:v1',JSON.stringify(state))}catch{}},[state,ready]);
 return [state,setState,ready] as const;
}
