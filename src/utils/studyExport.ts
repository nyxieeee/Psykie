import JSZip from 'jszip'
import { plainText } from '../../supabase/functions/_shared/plainText'
import type { AIDraft } from './ai'

const escape = (value: string) => plainText(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]!))
const filename = (title: string) => Array.from(plainText(title)).filter(char=>char.charCodeAt(0)>=32).join('').replace(/[<>:"/\\|?*]/g, '').trim().slice(0,100) || 'Psykie study material'

export async function downloadWord(title: string, text: string) {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  const paragraph = (line: string, heading = false) => `<w:p><w:pPr><w:spacing w:after="160"/></w:pPr><w:r>${heading?'<w:rPr><w:b/><w:color w:val="BE5B6C"/><w:sz w:val="32"/></w:rPr>':''}<w:t xml:space="preserve">${escape(line)}</w:t></w:r></w:p>`
  zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraph(title,true)}${plainText(text).split(/\r?\n/).map(line=>paragraph(line)).join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>`)
  const blob = await zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})
  const url=URL.createObjectURL(blob),link=document.createElement('a')
  link.href=url;link.download=filename(title)+'.docx';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}

export function reviewerText(draft: AIDraft) {
  return [draft.summary,'KEY POINTS',...draft.keyPoints,'FLASHCARDS',...draft.cards.map((card,i)=>`${i+1}. ${card.question}\n${card.answer}`),'SELF-TEST',...draft.questions.map((question,i)=>`${i+1}. ${question.question}\n${question.options.map((option,j)=>`${String.fromCharCode(65+j)}. ${option}`).join('\n')}\nAnswer: ${question.options[question.correct]}\n${question.explanation}`)].join('\n\n')
}

export function printFlashcards(title: string, cards: {question:string;answer:string}[]) {
  const popup=window.open('', '_blank')
  if(!popup)throw new Error('Allow pop-ups for Psykie to open the printable flashcards.')
  popup.opener=null
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><style>
    @page{size:A4;margin:12mm}*{box-sizing:border-box}body{font:14px/1.5 Arial,sans-serif;color:#282027;margin:24px}h1{font-size:24px;color:#a84058}header{max-width:900px;margin:auto auto 24px}.tools{display:flex;gap:12px;align-items:center;flex-wrap:wrap}button{padding:12px 20px;background:#be5b6c;border:0;border-radius:24px;color:white;font:inherit;cursor:pointer}.card{display:grid;grid-template-columns:1fr 1fr;border:1px dashed #9d8790;margin:0 auto 18px;max-width:900px;break-inside:avoid;page-break-inside:avoid}.side{padding:22px;min-height:150px;white-space:pre-wrap;overflow-wrap:anywhere}.side+ .side{border-left:1px dotted #9d8790}.label{display:block;color:#a84058;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}@media print{body{margin:0}.tools{display:none}h1{font-size:18px}.card{margin-bottom:8mm}.side{padding:6mm}}@media screen and (max-width:500px){body{margin:12px}.side{padding:12px;font-size:12px}}
    </style></head><body><header><h1>${escape(title)}</h1><p>Cut along the dashed border. Fold along the dotted center so the question and answer face outward. Tape or glue the backs together.</p><div class="tools"><button id="print">Print / Save as PDF</button><span>${cards.length} cards</span></div></header>${cards.map((card,i)=>`<article class="card"><section class="side"><span class="label">${i+1} / Question</span>${escape(card.question)}</section><section class="side"><span class="label">${i+1} / Answer</span>${escape(card.answer)}</section></article>`).join('')}</body></html>`)
  popup.document.close()
  popup.document.getElementById('print')!.onclick=()=>popup.print()
  popup.focus()
}

export function printStudyDocument(title:string,text:string){
  const popup=window.open('','_blank')
  if(!popup)throw Error('Allow pop-ups for Psykie to open the printable document.')
  popup.opener=null
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><style>@page{size:A4;margin:18mm}body{font:15px/1.7 Arial,sans-serif;color:#282027;max-width:850px;margin:24px auto;padding:0 16px}h1{color:#a84058;font-size:24px}main{white-space:pre-wrap;overflow-wrap:anywhere}.print-section+.print-section{break-before:page}button{border:0;border-radius:24px;padding:12px 20px;background:#be5b6c;color:white;font:inherit}@media print{body{max-width:none;margin:0;padding:0}button{display:none}h1{font-size:20px}}</style></head><body><h1>${escape(title)}</h1><button id="print">Print / Save as PDF</button><main>${text.split('\f').map(part=>'<section class="print-section">'+escape(part)+'</section>').join('')}</main></body></html>`)
  popup.document.close();popup.document.getElementById('print')!.onclick=()=>popup.print();popup.focus()
}
export function printQuiz(title:string,questions:AIDraft['questions']){
  const questionsText=questions.map((question,i)=>`${i+1}. ${question.question}\n${question.format?'Answer: ________________________________________\n':question.options.map((answer,j)=>String.fromCharCode(65+j)+'. '+answer).join('\n')}`).join('\n\n')
  printStudyDocument(title,`Name: ________________________    Date: ______________\n\n${questionsText}\fANSWER KEY\n\n${questions.map((question,i)=>`${i+1}. ${question.options[question.correct]}\n${question.explanation}`).join('\n\n')}`)
}

export async function downloadStudySlides(title:string,draft:AIDraft){
  const {default:PptxGenJS}=await import('pptxgenjs')
  const presentation=new PptxGenJS()
  presentation.layout='LAYOUT_WIDE';presentation.author='Psykie';presentation.subject='Psychology study material';presentation.title=plainText(title)
  const frame=(heading:string,body:string,notes:string)=>{
    const slide=presentation.addSlide();slide.background={color:'FBF4F2'}
    slide.addText(plainText(heading),{x:.8,y:.55,w:11.7,h:1.1,fontSize:28,bold:true,color:'65313D',fontFace:'Arial',fit:'shrink'})
    slide.addText(plainText(body),{x:.8,y:1.9,w:11.7,h:4.5,fontSize:22,color:'34282E',fontFace:'Arial',breakLine:false,fit:'shrink',valign:'top'})
    slide.addText('Psykie | Psychology study slides',{x:.8,y:7,w:11.7,h:.2,fontSize:10,color:'BE5B6C'})
    slide.addNotes(plainText(notes))
  }
  frame(title,'Study guide\nReview these slides alongside your original material.','Created from the saved AI study reviewer. Check information against the source.')
  let heading='Overview',buffer=''
  const flush=()=>{if(!buffer.trim())return;const words=buffer.trim().split(/\s+/);let chunk='',part=0;for(const word of words){if(chunk.length+word.length>650&&chunk){frame(heading+(part++?' (continued)':''),chunk,chunk);chunk=''}chunk+=(chunk?' ':'')+word}if(chunk)frame(heading+(part?' (continued)':''),chunk,chunk);buffer=''}
  for(const line of plainText(draft.summary).split('\n')){
    if(/^[A-Z][A-Z &,:\d-]{3,100}$/.test(line.trim())){flush();heading=line.trim()}
    else buffer+=line+'\n'
  }
  flush()
  heading='Key points';buffer=draft.keyPoints.map(plainText).join('\n\n');flush()
  await presentation.writeFile({fileName:filename(title)+'.pptx'})
}
