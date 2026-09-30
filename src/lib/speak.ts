'use client';

function prepare(text:string){
 if(typeof window==='undefined'||!('speechSynthesis'in window))return null;
 const voices=window.speechSynthesis.getVoices();
 const voice=voices.find(v=>v.lang.toLowerCase().startsWith('zh-cn'))??voices.find(v=>v.lang.toLowerCase().startsWith('zh-tw'))??voices.find(v=>v.lang.toLowerCase().startsWith('zh'));
 if(voices.length>0&&!voice)return null;
 const utterance=new SpeechSynthesisUtterance(text);
 if(voice)utterance.voice=voice;
 utterance.lang=voice?.lang??'zh-CN';
 utterance.rate=.85;
 return utterance;
}

export function speak(text:string){
 const utterance=prepare(text);
 if(!utterance)return false;
 window.speechSynthesis.cancel();
 window.speechSynthesis.speak(utterance);
 return true;
}

export function speakMany(texts:string[]){
 const utterances=texts.map(prepare);
 if(utterances.some(utterance=>!utterance)||utterances.length===0)return false;
 window.speechSynthesis.cancel();
 for(const utterance of utterances)window.speechSynthesis.speak(utterance!);
 return true;
}
