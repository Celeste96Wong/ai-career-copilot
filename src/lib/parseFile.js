import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export async function parseFile(file) {
  const fileType = file.name.split('.').pop().toLowerCase()

  if (fileType === 'pdf') {
    return await parsePDF(file)
  } else if (fileType === 'docx') {
    return await parseDOCX(file)
  } else {
    throw new Error('Unsupported file type. Please upload PDF or DOCX.')
  }
}

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map(item => item.str).join(' ')
    text += pageText + '\n'
  }

  if (text.trim().length < 50) {
    throw new Error('Could not extract text from this PDF. It may be image-based. Please try a text-based PDF.')
  }

  return cleanText(text)
}

async function parseDOCX(file) {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })

  if (!result.value || result.value.trim().length < 50) {
    throw new Error('Could not extract text from this DOCX file.')
  }

  return cleanText(result.value)
}

function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\x20-\x7E\n]/g, '')
    .trim()
}