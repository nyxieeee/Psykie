/** Remove Markdown presentation syntax while retaining readable text and link targets. */
export function plainText(value:string):string {
  return value
    .replace(/```[^\n]*\n([\s\S]*?)```/g,'$1')
    .replace(/~~~[^\n]*\n([\s\S]*?)~~~/g,'$1')
    .replace(/`{3,}([^`]*?)`{3,}/g,'$1')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1 ($2)')
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/gm,'$1')
    .replace(/^[ \t]{0,3}>[ \t]?/gm,'')
    .replace(/^[ \t]*[-*+][ \t]+\[[ xX]\][ \t]+/gm,'')
    .replace(/^[ \t]*[-*+][ \t]+/gm,'\u2022 ')
    .replace(/^[ \t]*(?:[-*_][ \t]*){3,}$/gm,'')
    .replace(/\*\*([\s\S]+?)\*\*/g,'$1')
    .replace(/__([^\n]+?)__/g,'$1')
    .replace(/~~([^\n]+?)~~/g,'$1')
    .replace(/`([^`\n]+)`/g,'$1')
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g,'$1$2')
    .replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,!?:;]|$)/g,'$1$2')
    .replace(/^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?[ \t]*$/gm,'')
    .replace(/^[ \t]*\|(.+)\|[ \t]*$/gm,(_,row:string)=>row.split('|').map(cell=>cell.trim()).join(' - '))
    .replace(/\\([\\`*_{}[\]()#+.!>~-])/g,'$1')
    .replace(/\n{3,}/g,'\n\n').trim()
}
