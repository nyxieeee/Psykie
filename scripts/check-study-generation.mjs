import assert from 'node:assert/strict'
import {build} from 'esbuild'
const compiled=await build({entryPoints:['src/utils/studyGeneration.ts'],bundle:true,format:'esm',platform:'node',write:false})
const {generateStudyDraft}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'))
const calls=[],checkpoints=[]
let serial=0,failAt=0
const request=async(task,text,category,count)=>{calls.push({task,text,count});if(calls.length===failAt)throw Error('Provider limit');return {title:'Psychology practice',summary:task==='summary'||task==='reviewer'?'Summary '+text.slice(0,120):'',keyPoints:task==='summary'||task==='reviewer'?['Source-grounded point']:[],cards:task==='flashcards'||task==='reviewer'?Array.from({length:count},()=>({question:'Card '+(++serial),answer:'A supported concept'})):[],questions:task==='quiz'||task==='reviewer'?Array.from({length:count},()=>({question:'Question '+(++serial),options:['Correct','Other','Third','Fourth'],correct:0,explanation:'Source explanation'})):[]}}
const options={wait:async()=>{},onCheckpoint:checkpoint=>checkpoints.push(checkpoint)}
let result=await generateStudyDraft(request,'quiz','Learning and memory','Psychology',100,options)
assert.equal(result.questions.length,100);assert.equal(calls.length,20);assert(calls.every(call=>call.count===5&&call.text.length<25000));assert.equal(new Set(result.questions.map(item=>item.question)).size,100)
calls.length=0;checkpoints.length=0;failAt=3
await assert.rejects(()=>generateStudyDraft(request,'quiz','Attachment theory','Psychology',30,options),/Provider limit/)
const saved=checkpoints.at(-1);assert.equal(saved.completed,10)
failAt=0;calls.length=0
result=await generateStudyDraft(request,'quiz','Attachment theory','Psychology',30,{...options,checkpoint:saved})
assert.equal(result.questions.length,30);assert.equal(calls.length,4);assert.deepEqual(result.questions.slice(0,10),saved.draft.questions)
calls.length=0
const longSource=Array.from({length:12},(_,i)=>`SECTION ${i+1}\n`+'Psychology concepts, definitions and evidence. '.repeat(350)).join('\n')
result=await generateStudyDraft(request,'quiz',longSource,'Psychology',10,options)
assert.equal(result.questions.length,10);assert(calls.filter(call=>call.task==='summary').length>=10);assert(calls.every(call=>call.text.length<25000));assert(calls.some(call=>call.task==='summary'&&call.text.includes('SECTION 12')))
calls.length=0
result=await generateStudyDraft(request,'quiz','Learning theory','Psychology',5,{...options,quizOptions:{style:'identification',difficulty:'medium'}})
assert(result.questions.every(question=>question.format==='identification'&&question.options.length===1&&question.correct===0))
const abort=new AbortController();abort.abort();await assert.rejects(()=>generateStudyDraft(request,'quiz','Memory','Psychology',100,{signal:abort.signal,wait:async()=>{}}))
await assert.rejects(()=>generateStudyDraft(request,'quiz','Memory','Psychology',101),/between 1 and 100/)
const quizCompiled=await build({entryPoints:['src/utils/quizPractice.ts'],bundle:true,format:'esm',platform:'node',write:false})
const {createQuizSession,completeQuizSession,normalizeWrittenAnswer}=await import('data:text/javascript;base64,'+Buffer.from(quizCompiled.outputFiles[0].text).toString('base64'))
const quiz={id:'shuffle-test',title:'Learning',category:'Psychology',timerMinutes:180,shuffleQuestions:true,shuffleAnswers:true,questions:[{question:'Memory?',options:['A','B','Correct','D'],correct:2,explanation:'Explanation'},{question:'Learning?',options:['Wrong','Correct','Other','Fourth'],correct:1,explanation:'Explanation'}]}
const original=structuredClone(quiz),random=Math.random;Math.random=()=>0
const session=createQuizSession(quiz,quiz.questions,1000);Math.random=random
assert.deepEqual(quiz,original);assert.equal(session.deadline,10801000)
session.answers=session.questions.map(question=>question.options.indexOf('Correct'))
const attempt=completeQuizSession(quiz,session,false,61000);assert.equal(attempt.percentage,100);assert.equal(attempt.durationSeconds,60)
assert.equal(normalizeWrittenAnswer('  Cognitive-Bias! '),normalizeWrittenAnswer('cognitive bias'))
console.log('Passed: 100 questions in bounded batches, resume without lost items, full long-source coverage, written-answer format, cancellation, count limits, shuffled-answer grading and timer settings.')
