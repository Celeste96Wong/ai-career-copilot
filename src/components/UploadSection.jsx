import { useState, useRef } from 'react'
import { parseFile } from '../lib/parseFile'

export default function UploadSection({ onAnalyze, isLoading }) {
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  const handleFile = async (file) => {
    setError(null)
    if (!file) return

    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx'].includes(ext)) {
      setError('Please upload a PDF or DOCX file only.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.')
      return
    }

    setFileName(file.name)

    try {
      const text = await parseFile(file)
      onAnalyze(text)
    } catch (err) {
      setError(err.message)
      setFileName(null)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const onInputChange = (e) => {
    handleFile(e.target.files[0])
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
          ${dragOver ? 'border-brand bg-brand/10' : 'border-border bg-card hover:border-brand/60 hover:bg-card/80'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={onInputChange}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>

          {fileName ? (
            <div>
              <p className="text-white font-medium">{fileName}</p>
              <p className="text-muted text-sm mt-1">File ready — analyzing...</p>
            </div>
          ) : (
            <div>
              <p className="text-white font-medium">Drop your resume here</p>
              <p className="text-muted text-sm mt-1">PDF or DOCX · Max 5MB</p>
            </div>
          )}

          {!fileName && (
            <button
              type="button"
              className="mt-2 px-5 py-2 bg-brand hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
              onClick={(e) => { e.stopPropagation(); inputRef.current.click() }}
            >
              Browse Files
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
      )}

      {isLoading && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm">Analyzing your resume with AI...</p>
        </div>
      )}
    </div>
  )
}