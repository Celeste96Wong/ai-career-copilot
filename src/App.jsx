import { useState } from 'react'
import UploadSection from './components/UploadSection'
import ResultSection from './components/ResultSection'
import StatsBar from './components/StatsBar'
import { incrementResumeCount } from './lib/supabase'

export default function App() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async (resumeText) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.')
      }

      setResult(data)
      await incrementResumeCount()

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-surface text-white">

      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center text-xs font-bold">AI</div>
          <span className="font-semibold text-white">Career Copilot</span>
        </div>
        <span className="text-xs text-muted bg-card border border-border px-3 py-1 rounded-full">Beta · Free</span>
      </nav>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 py-16">

        {!result && !isLoading && (
          <>
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand text-xs font-medium px-4 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                AI-Powered Resume Analysis
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
                Get Your Resume<br />
                <span className="text-brand">AI-Reviewed</span> Instantly
              </h1>
              <p className="text-muted text-lg max-w-md mx-auto">
                Upload your resume and get an ATS score, strengths, and actionable tips in seconds.
              </p>
            </div>

            {/* Stats */}
            <StatsBar />

            {/* Upload */}
            <div className="mt-10">
              <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
          </>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-24">
            <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-muted">Analyzing your resume with AI...</p>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-center mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
            <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        )}

        {result && !isLoading && (
          <ResultSection result={result} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-muted text-xs">
        Built for early career professionals in Malaysia & Singapore · AI Career Copilot © 2026
      </footer>

    </div>
  )
}