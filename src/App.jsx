import { useState, useEffect } from 'react'
import UploadSection from './components/UploadSection'
import ResultSection from './components/ResultSection'
import StatsBar from './components/StatsBar'
import { incrementResumeCount, incrementUserCount } from './lib/supabase'

export default function App() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [limitReached, setLimitReached] = useState(false)
  const [paymentToken, setPaymentToken] = useState(null)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    const urlToken = params.get('token')

    console.log('DEBUG useEffect - sessionId:', sessionId)
    console.log('DEBUG useEffect - urlToken:', urlToken)

    if (urlToken) {
      setPaymentToken(urlToken)
      window.history.replaceState({}, '', '/')
    }

    if (sessionId) {
      handlePaymentSuccess(sessionId)
    }
  }, [])

  const handlePaymentSuccess = async (sessionId) => {
    console.log('DEBUG handlePaymentSuccess called with:', sessionId)
    setProcessingPayment(true)

    try {
      const res = await fetch('/api/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })

      console.log('DEBUG payment-success response status:', res.status)

      const data = await res.json()

      console.log('DEBUG payment-success data:', data)

      if (data.token) {
        setPaymentToken(data.token)
        setLimitReached(false)
        window.history.replaceState({}, '', '/')
      } else {
        console.error('No token returned:', data)
      }
    } catch (err) {
      console.error('Payment success error:', err)
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleAnalyze = async (resumeText, careerLevel, targetRole) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setLimitReached(false)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, careerLevel, targetRole, paymentToken })
      })

      const data = await response.json()

      if (response.status === 429 && data.error === 'limit_reached') {
        setLimitReached(true)
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.')
      }

      if (paymentToken) setPaymentToken(null)

      setResult(data)
      await incrementResumeCount()

      const isNewUser = !localStorage.getItem('acc_visited')
      if (isNewUser) {
        localStorage.setItem('acc_visited', 'true')
        await incrementUserCount()
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setLimitReached(false)
  }

  return (
    <div className="min-h-screen bg-surface text-white">

      <nav className="border-b border-border px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center text-xs font-bold">AI</div>
          <span className="font-semibold text-white">Career Copilot</span>
        </div>
        <span className="text-xs text-muted bg-card border border-border px-3 py-1 rounded-full">Beta · Free</span>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">

        {processingPayment && (
          <div className="flex flex-col items-center gap-4 py-24">
            <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-muted">Processing your payment...</p>
            <p className="text-muted text-xs">Please wait a moment</p>
          </div>
        )}

        {!result && !isLoading && !limitReached && !processingPayment && (
          <>
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
                Upload your resume, select your career level and target role — get ATS scoring, strengths, and actionable tips in seconds.
              </p>
            </div>

            <StatsBar />

            {paymentToken && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                <p className="text-emerald-400 text-sm font-medium">✅ Payment successful — your analysis is unlocked. Upload your resume below.</p>
              </div>
            )}

            <div className="mt-10">
              <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
          </>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-24">
            <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-muted">Analyzing your resume with AI...</p>
            <p className="text-muted text-xs">This usually takes 10–20 seconds</p>
          </div>
        )}

        {limitReached && (
          <PaywallSection />
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

      <footer className="border-t border-border py-6 text-center text-muted text-xs">
        Built for early career professionals in Malaysia & Singapore · AI Career Copilot © 2026
      </footer>

    </div>
  )
}

function PaywallSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUnlock = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div>
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-semibold text-white mb-2">Free Limit Reached</h2>
          <p className="text-muted text-sm leading-relaxed">
            You have used your 2 free analyses today. Unlock one more analysis for RM3.90.
          </p>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-left space-y-2">
          <p className="text-white text-sm font-medium">What you get:</p>
          <p className="text-slate-300 text-xs">✅ Full resume analysis</p>
          <p className="text-slate-300 text-xs">✅ ATS Score + Market Score</p>
          <p className="text-slate-300 text-xs">✅ Role Fit Matrix</p>
          <p className="text-slate-300 text-xs">✅ Keyword Intelligence</p>
          <p className="text-slate-300 text-xs">✅ Rewrite Examples</p>
          <p className="text-slate-300 text-xs">✅ Results sent to your email</p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleUnlock}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Redirecting...' : 'Unlock for RM3.90 →'}
          </button>

          <p className="text-slate-500 text-xs">
            One-time payment · No subscription · No refund after analysis is delivered
          </p>
        </div>
      </div>
    </div>
  )
}