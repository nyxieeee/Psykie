import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

export const MAX_SOURCE_LENGTH = 25000
export const MAX_OCR_PAGES = 5
export const STUDY_UPLOAD_ACCEPT = '.pdf,.docx,.txt,.md,.csv,.jpg,.jpeg,.png,.webp'
type UploadOptions = {ocr?: (image: string, signal?: AbortSignal) => Promise<string>; onProgress?: (message: string) => void; signal?: AbortSignal}
const requireOCR = (options: UploadOptions) => {
  if (!options.ocr) throw new Error('Enable AI OCR to read photos or scanned PDF pages. Images are sent to Mistral and use your AI allowance.')
  return options.ocr
}
function canvasImage(canvas: HTMLCanvasElement): string {
  const image = canvas.toDataURL('image/jpeg', 0.85)
  if (image.length > 2000000) throw new Error('This image is too detailed to read in one request. Crop it into smaller sections.')
  return image
}
async function prepareImage(file: File): Promise<string> {
  let bitmap: ImageBitmap
  try { bitmap = await createImageBitmap(file) } catch { throw new Error('This image could not be opened. Choose a valid JPEG, PNG, or WebP file.') }
  try {
    if (bitmap.width * bitmap.height > 40000000) throw new Error('Resize this photo to 40 megapixels or fewer before uploading.')
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Your browser could not prepare this image.')
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return canvasImage(canvas)
  } finally { bitmap.close() }
}

export async function readStudyUpload(file: File, options: UploadOptions = {}): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error('Choose a file smaller than 10 MB.')
  options.signal?.throwIfAborted()
  const extension = file.name.split('.').pop()?.toLowerCase()
  let text = ''
  if (['txt', 'md', 'csv'].includes(extension || '')) text = await file.text()
  else if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
    const ocr = requireOCR(options)
    options.onProgress?.('Preparing image for AI OCR...')
    const image = await prepareImage(file)
    options.signal?.throwIfAborted()
    options.onProgress?.('Reading image with AI OCR...')
    text = await ocr(image, options.signal)
  } else if (extension === 'docx') {
    const mammoth = await import('mammoth')
    text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value
  } else if (extension === 'pdf') {
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer(), isEvalSupported: false }).promise
    try {
      if (pdf.numPages > 100) throw new Error('Choose a PDF with 100 pages or fewer, or paste an excerpt.')
      const pages: {number: number; text: string; scanned: boolean}[] = []
      for (let number = 1; number <= pdf.numPages; number++) {
        options.signal?.throwIfAborted()
        options.onProgress?.(`Reading PDF page ${number} of ${pdf.numPages}...`)
        const page = await pdf.getPage(number), content = await page.getTextContent()
        const pageText = content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('').trim()
        let scanned = false
        if (pageText.length < 20) {
          const operators = await page.getOperatorList()
          scanned = operators.fnArray.some(op => [pdfjs.OPS.paintImageXObject, pdfjs.OPS.paintInlineImageXObject, pdfjs.OPS.paintImageXObjectRepeat].includes(op)) || (!pageText && operators.fnArray.length > 0)
        }
        pages.push({number, text:pageText, scanned})
        if (pages.reduce((length,item) => length+item.text.length,0) > MAX_SOURCE_LENGTH) throw new Error('This document exceeds 25,000 characters. Upload a shorter excerpt.')
      }
      const scans = pages.filter(page => page.scanned)
      if (scans.length > MAX_OCR_PAGES) throw new Error(`This PDF has ${scans.length} scanned pages. Upload up to ${MAX_OCR_PAGES} scanned pages at a time so OCR stays within your AI allowance. No OCR requests were sent.`)
      if (scans.length) requireOCR(options)
      for (const page of pages) {
        options.signal?.throwIfAborted()
        if (page.scanned) {
          options.onProgress?.(`AI OCR: PDF page ${page.number} of ${pdf.numPages}...`)
          const original = await pdf.getPage(page.number), base = original.getViewport({scale:1})
          const viewport = original.getViewport({scale:1600 / Math.max(base.width,base.height)})
          const canvas = document.createElement('canvas'); canvas.width = Math.round(viewport.width); canvas.height = Math.round(viewport.height)
          const canvasContext = canvas.getContext('2d')
          if (!canvasContext) throw new Error('Your browser could not render this scanned page.')
          const render = original.render({canvasContext,viewport})
          const cancel = () => render.cancel()
          options.signal?.addEventListener('abort',cancel,{once:true})
          try { await render.promise } finally { options.signal?.removeEventListener('abort',cancel) }
          options.signal?.throwIfAborted()
          page.text = (await requireOCR(options)(canvasImage(canvas),options.signal)) || page.text
          original.cleanup()
        }
        text += page.text + '\n\n'
        if (text.length > MAX_SOURCE_LENGTH) break
      }
    } finally { await pdf.destroy() }
  } else throw new Error('Choose a PDF, DOCX, TXT, Markdown, CSV, JPEG, PNG, or WebP file.')
  options.signal?.throwIfAborted()
  text = text.split(String.fromCharCode(0)).join('').trim()
  if (!text) throw new Error('No readable text found. Try a clearer image or scan, or paste the text manually.')
  if (text.length > MAX_SOURCE_LENGTH) throw new Error('This document exceeds 25,000 characters. Upload a shorter excerpt or paste the sections you want to study.')
  return text
}
