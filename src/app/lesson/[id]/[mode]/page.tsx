import Reviewer from '@/components/Reviewer';
export const dynamic='force-static';
const modes=['list','flashcard','focus','write','quiz','dialogue','grammar'];
export function generateStaticParams(){return ['1','2','3','4','5','6','7','8','all'].flatMap(id=>modes.map(mode=>({id,mode})))}
export default function LessonModePage(){return <Reviewer/>}
