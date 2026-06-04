const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_FORM_LINK_HERE'

const scoreColor = (score) => {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

const scoreRing = (score) => {
  if (score >= 80) return 'stroke-emerald-400'
  if (score >= 60) return 'stroke-yellow-400'
  if (score >= 40) return 'stroke-orange-400'
  return 'stroke-red-400'
}

function ScoreCircle({ score }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#2a2d3a" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          className={scoreRing(score)}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="70" y="70" textAnchor="middle" dominantBaseline="central"
          fill="white" fontSize="28" fontWeight="700" fontFamily="Inter">
          {score}
        </text>
      </svg>
      <p className={`text-sm font-semibold ${scoreColor(score)}`}>ATS Score</p>
    </div>
  )
}

function Section({ title, items, color }) {
  const colorMap = {
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    blue: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  }

  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-300 flex gap-2">
            <span className="mt-0.5 shrink-0">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ResultSection({ result, onReset }) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">

      {/* Score */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-2">
        <ScoreCircle score={result.score} />
        <p className={`text-lg font-semibold mt-1 ${scoreColor(result.score)}`}>{result.scoreLabel}</p>
        <p className="text-muted text-sm text-center max-w-xs mt-1">
          Based on ATS keyword matching, structure, experience quality, and presentation.
        </p>
        {result.benchmark && (
          <p className="text-slate-400 text-sm text-center max-w-sm mt-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
            📊 {result.benchmark}
          </p>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid gap-4">
        <Section title="✅ Strengths" items={result.strengths} color="green" />
        <Section title="⚠️ Improvements Needed" items={result.improvements} color="red" />
        <Section title="💡 Actionable Tips" items={result.tips} color="blue" />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl border border-border text-slate-300 hover:border-brand/60 hover:text-white transition-colors text-sm font-medium"
        >
          Analyze Another Resume
        </button>
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-xl bg-brand hover:bg-indigo-500 text-white text-center transition-colors text-sm font-medium"
        >
          {'💬'} Give Feedback
        </a>
      </div>
    </div>
  )
}