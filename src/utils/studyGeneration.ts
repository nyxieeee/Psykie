import { validateDraft, type AIDraft, type AITask, type QuizOptions } from '../../supabase/functions/_shared/contracts'

export const MAX_STUDY_TEXT=1000000
export const MAX_STUDY_ITEMS=100
export const AGGREGATE_LIMITS={questions:100,cards:100,summary:1000000,keyPoints:1000}
export type GenerationCheckpoint={key:string;draft:AIDraft;completed:number;nextBatch:number;sections:string[]}
type Request=(task:AITask,text:string,category:string,count:number,signal?:AbortSignal,options?:QuizOptions)=>Promise<AIDraft>
type Options={signal?:AbortSignal;quizOptions?:QuizOptions;onProgress?:(message:string)=>void;onCheckpoint?:(checkpoint:GenerationCheckpoint)=>void;checkpoint?:GenerationCheckpoint;wait?:(signal?:AbortSignal)=>Promise<void>}
const blank=():AIDraft=>({title:'',summary:'',keyPoints:[],cards:[],questions:[]})
const identity=(value:string)=>value.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'')
export function splitStudyText(text:string,size=18000):string[]{
  const chunks:string[]=[];let remaining=text.trim()
  while(remaining.length>size){const split=remaining.lastIndexOf('\n',size);const end=split>size*.6?split:size;chunks.push(remaining.slice(0,end));remaining=remaining.slice(end).trim()}
  if(remaining)chunks.push(remaining)
  return chunks
}
export function generationKey(task:AITask,text:string,category:string,count:number,options?:QuizOptions){let hash=2166136261;const input=JSON.stringify([task,text,category,count,options]);for(let i=0;i<input.length;i++)hash=Math.imul(hash^input.charCodeAt(i),16777619);return task+':'+input.length+':'+(hash>>>0)}
export function waitForStudyRequest(signal?:AbortSignal):Promise<void>{
  return new Promise((resolve,reject)=>{signal?.throwIfAborted();const abort=()=>{clearTimeout(timer);reject(signal?.reason||new DOMException('Cancelled','AbortError'))};const timer=setTimeout(()=>{signal?.removeEventListener('abort',abort);resolve()},8100);signal?.addEventListener('abort',abort,{once:true})})
}
/** Keep individual model calls small; checkpoints retain successful batches on failure. */
export async function generateStudyDraft(request:Request,task:AITask,text:string,category:string,count:number,options:Options={}):Promise<AIDraft>{
  if(!text.trim()||text.length>MAX_STUDY_TEXT)throw Error('Choose readable study material of up to 1,000,000 characters.')
  if(!Number.isInteger(count)||count<1||count>MAX_STUDY_ITEMS)throw Error('Choose between 1 and 100 items.')
  const key=generationKey(task,text,category,count,options.quizOptions),saved=options.checkpoint?.key===key?options.checkpoint:undefined
  const draft=saved?structuredClone(saved.draft):blank(),sections=saved?[...saved.sections]:[]
  let completed=saved?.completed||0,nextBatch=saved?.nextBatch||0,calls=0
  const chunks=splitStudyText(text)
  const focus=text.match(/^Requested topics and focus: ([\s\S]*?)(?:\nStudy material:|$)/)?.[1]?.slice(0,2000)||''
  const checkpoint=()=>options.onCheckpoint?.({key,draft:structuredClone(draft),completed,nextBatch,sections:[...sections]})
  const call=async(action:AITask,source:string,amount:number)=>{options.signal?.throwIfAborted();if(calls++)await(options.wait||waitForStudyRequest)(options.signal);const style=options.quizOptions?.style;const extra=style==='identification'?'Write each question as a direct identification prompt whose answer is a short psychology term.':style==='fill-blank'?'Write each question as a sentence with one blank (____) to fill with the correct psychology term.':style==='case-study'?'Use a fictional psychology case vignette for each question.':style==='research'?'Focus on interpreting research design, evidence and statistical reasoning supported by the source.':style==='ethics'?'Focus on psychology ethics and professional judgment supported by the source.':'';const safeOptions=options.quizOptions&&{...options.quizOptions,style:['multiple-choice','true-false','scenario','mixed'].includes(style||'')?style as QuizOptions['style']:'multiple-choice' as const};const part=validateDraft(await request(action,'Requested topics and focus: '+[focus,extra].filter(Boolean).join(' ')+'\nStudy material:\n'+source,category,amount,options.signal,safeOptions),action);if(action==='quiz'&&(style==='identification'||style==='fill-blank'))part.questions=part.questions.map(question=>({...question,options:[question.options[question.correct]],correct:0,format:style}));return part}
  // Condense every section first when there are more source sections than quiz batches.
  if((task==='quiz'||task==='flashcards')&&chunks.length>Math.ceil(count/5)){
    for(let index=sections.length;index<chunks.length;index++){
      options.onProgress?.(`Reading source section ${index+1} of ${chunks.length}...`)
      const section=await call('summary',chunks[index],8)
      sections.push(section.summary+'\n'+section.keyPoints.join('\n'));checkpoint()
    }
  }
  let sources=sections.length?splitStudyText(sections.join('\n\n')):chunks
  if(task==='quiz'||task==='flashcards'){
    const capacity=Math.ceil(count/5)*18000
    for(let round=0;sources.join('\n\n').length>capacity;round++){
      if(round===3)throw Error('The source could not be condensed enough. Choose more questions or a smaller set of materials.')
      const reduced:string[]=[]
      for(let index=0;index<sources.length;index++){
        options.onProgress?.(`Organizing source coverage: section ${index+1} of ${sources.length}...`)
        const part=await call('summary','Summarize the following study section in 150 words or fewer, retaining key concepts and distinctions.\n'+sources[index],8)
        reduced.push(part.summary)
      }
      sources=splitStudyText(reduced.join('\n\n'))
    }
  }
  if(task==='summary'||task==='reviewer'){
    for(let index=nextBatch;index<chunks.length;index++){
      options.onProgress?.(`Creating ${task==='reviewer'?'reviewer':'summary'} section ${index+1} of ${chunks.length}...`)
      const part=await call(task,chunks[index],Math.min(count,8))
      if(!draft.title)draft.title=part.title
      draft.summary+=(draft.summary?'\n\n':'')+(chunks.length>1?'SOURCE SECTION '+(index+1)+'\n':'')+part.summary
      draft.keyPoints.push(...part.keyPoints);draft.cards.push(...part.cards.slice(0,Math.max(0,100-draft.cards.length)));draft.questions.push(...part.questions.slice(0,Math.max(0,100-draft.questions.length)))
      nextBatch=index+1;completed=nextBatch;checkpoint()
    }
  }else{
    const total=Math.ceil(count/5),seen=new Set((task==='quiz'?draft.questions:draft.cards).map(item=>identity(item.question)))
    for(let batch=nextBatch;batch<total;batch++){
      options.onProgress?.(`Generating ${task==='quiz'?'questions':'cards'}: ${completed} of ${count} ready (batch ${batch+1} of ${total})...`)
      const amount=Math.min(5,count-completed),source=sources.join('\n\n')
      const context=source.length<=18000?source:source.slice(Math.floor(batch*source.length/total),Math.floor((batch+1)*source.length/total))
      const previous=(task==='quiz'?draft.questions:draft.cards).slice(-20).map(item=>item.question.slice(0,160)).join('\n')
      const input=`Study material:\n${context}\n\nBatch ${batch+1} of ${total}. Focus on different concepts and examples from earlier batches. Avoid repeating these questions:\n${previous}`
      const part=await call(task,input,amount)
      if(!draft.title)draft.title=part.title
      const fresh=(task==='quiz'?part.questions:part.cards).filter(item=>{const id=identity(item.question);if(seen.has(id))return false;seen.add(id);return true}).slice(0,amount)
      if(task==='quiz')draft.questions.push(...fresh as AIDraft['questions']);else draft.cards.push(...fresh as AIDraft['cards'])
      completed=task==='quiz'?draft.questions.length:draft.cards.length
      if(!fresh.length){checkpoint();throw Error(`This batch contained no new questions. ${completed} items are saved in the draft. Resume generation or review the partial draft.`)}
      nextBatch=batch+1;checkpoint()
    }
  }
  return validateDraft(draft,task,AGGREGATE_LIMITS)
}
