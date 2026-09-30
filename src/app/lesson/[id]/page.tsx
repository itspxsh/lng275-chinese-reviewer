import Reviewer from '@/components/Reviewer';
export const dynamic='force-static';
export function generateStaticParams(){return [...Array.from({length:8},(_,i)=>({id:String(i+1)})),{id:'all'}]}
export default function LessonPage(){return <Reviewer/>}
