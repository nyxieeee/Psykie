/** Small, safe inline formatting for AI card text. HTML is always rendered as text. */
export function StudyText({text}:{text:string}) {
  return <>{text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/g).map((part,index)=>part.startsWith('**')&&part.endsWith('**')||part.startsWith('__')&&part.endsWith('__')?<strong key={index}>{part.slice(2,-2)}</strong>:part.startsWith('`')&&part.endsWith('`')?<code key={index}>{part.slice(1,-1)}</code>:part)}</>
}
