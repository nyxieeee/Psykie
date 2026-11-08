import { useId, useState } from 'react'
import { FileText, UploadSimple } from '@phosphor-icons/react'

export function StudyFilePicker({onSelect,disabled=false,accept,label='Study material file',hint='Any file, up to 10 MB. Readable documents can be used for AI practice.'}:{onSelect:(file:File)=>void;disabled?:boolean;accept?:string;label?:string;hint?:string}) {
  const id=useId(),[dragging,setDragging]=useState(false),[name,setName]=useState('')
  const choose=(file?:File)=>{if(file&&!disabled){setName(file.name);onSelect(file)}}
  return <div className={'study-file-picker'+(dragging?' is-dragging':'')+(disabled?' is-busy':'')} onDragOver={event=>{event.preventDefault();if(!disabled)setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={event=>{event.preventDefault();setDragging(false);choose(event.dataTransfer.files[0])}}>
    <input id={id} aria-label={label} type="file" accept={accept} disabled={disabled} onChange={event=>{choose(event.target.files?.[0]);event.target.value=''}}/>
    <label htmlFor={id}><span className="file-picker-icon">{name?<FileText size={28}/>:<UploadSimple size={28}/>}</span><strong>{disabled?'Reading your file...':name||'Drop a file here'}</strong><span>{name?'Choose another file to replace it':'or browse files on your device'}</span><span className="file-picker-button">{disabled?'Please wait':name?'Change file':'Browse files'}</span><small>{hint}</small></label>
  </div>
}
