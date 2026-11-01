import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

export const MAX_SOURCE_LENGTH = 25000

export async function readStudyUpload(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error('Choose a file smaller than 10 MB.')
  const extension = file.name.split('.').pop()?.toLowerCase()
  let text = ''
  if (['txt', 'md', 'csv'].includes(extension || '')) text = await file.text()
  else if (extension === 'docx') {
    const mammoth = await import('mammoth')
    text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value
  } else if (extension === 'pdf') {
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
    const document = await pdfjs.getDocument({ data: await file.arrayBuffer(), isEvalSupported: false }).promise
    try {
      if (document.numPages > 100) throw new Error('Choose a PDF with 100 pages or fewer, or paste an excerpt.')
      for (let page = 1; page <= document.numPages; page++) {
        const content = await (await document.getPage(page)).getTextContent()
        text += content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('') + '\n'
        if (text.length > MAX_SOURCE_LENGTH) break
      }
    } finally { await document.destroy() }
  } else throw new Error('Choose a PDF, DOCX, TXT, Markdown, or CSV file.')
  text = text.split(String.fromCharCode(0)).join('').trim()
  if (!text) throw new Error('No readable text found. For scanned documents, paste text obtained with OCR instead.')
  if (text.length > MAX_SOURCE_LENGTH) throw new Error('This document exceeds 25,000 characters. Upload a shorter excerpt or paste the sections you want to study.')
  return text
}
