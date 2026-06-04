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

function ResumeProfileCard({ profile }) {
  if (!profile) return null
  const f = profile.extractedFeatures

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Resume Profile</p>
        <p className="text-slate-300 text-sm leading-relaxed">{profile.summary}</p>
      </div>

      <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

        {f.education && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Education</p>
            <p className="text-xs text-slate-300">{f.education}</p>
          </div>
        )}

        {f.experience && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Experience</p>
            <p className="text-xs text-slate-300">{f.experience}</p>
          </div>
        )}

        {f.technicalSkills?.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Technical Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {f.technicalSkills.map((s, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {f.languages?.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Languages</p>
            <div className="flex flex-wrap gap-1.5">
              {f.languages.map((l, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}

        {f.projects?.length > 0 && (
          <div className="sm:col-span-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Projects</p>
            <div className="space-y-1">
              {f.projects.map((p, i) => (
                <p key={i} className="text-xs text-slate-300 flex gap-2">
                  <span className="text-indigo-400 shrink-0">→</span>
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        {f.notableAchievements?.length > 0 && (
          <div className="sm:col-span-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Notable Achievements</p>
            <div className="space-y-1">
              {f.notableAchievements.map((a, i) => (
                <p key={i} className="text-xs text-slate-300 flex gap-2">
                  <span className="text-emerald-400 shrink-0">★</span>
                  {a}
                </p>
              ))}
            </div>
          </div>
        )}

        {f.certifications?.length > 0 && (
          <div className="sm:col-span-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Certifications</p>
            <div className="flex flex-wrap gap-1.5">
              {f.certifications.map((c, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function PremiumSection({ result }) {
  const p = result.premium
  if (!p) return null

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="p-5 space-y-5">

        {/* Keyword Intelligence */}
        {p.keywordIntelligence && (
          <div className="rounded-xl border border-border p-4 space-y-4">
            <h3 className="text-white font-semibold text-sm">🔍 Keyword Intelligence</h3>

            {p.keywordIntelligence.detected?.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Detected in your resume:</p>
                <div className="space-y-2">
                  {p.keywordIntelligence.detected.map((k, i) => (
                    <div key={i} className={`flex items-start gap-2 text-xs p-2 rounded-lg border ${
                      k.status === 'strong'
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-yellow-500/20 bg-yellow-500/5'
                    }`}>
                      <span className={k.status === 'strong' ? 'text-emerald-400' : 'text-yellow-400'}>
                        {k.status === 'strong' ? '✓' : '⚠️'}
                      </span>
                      <div>
                        <span className={`font-medium ${k.status === 'strong' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {k.keyword}
                        </span>
                        {k.reason && <p className="text-slate-400 mt-0.5">{k.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.keywordIntelligence.missing?.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Missing critical keywords:</p>
                <div className="space-y-2">
                  {p.keywordIntelligence.missing.map((k, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg border border-red-500/20 bg-red-500/5">
                      <span className="font-medium text-red-400">{k.keyword}</span>
                      {k.reason && <p className="text-slate-400 mt-0.5">{k.reason}</p>}
                      {k.howToAdd && <p className="text-indigo-400 mt-0.5">→ {k.howToAdd}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Industry Fit */}
        {p.industryFit && (
          <div className="rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">🎯 Industry Fit</h3>
              <span className="text-2xl font-bold text-indigo-400">{p.industryFit.fitScore}%</span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-indigo-400 h-1.5 rounded-full transition-all"
                style={{ width: `${p.industryFit.fitScore}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-emerald-400 mb-2">Strong Match</p>
                <div className="space-y-2">
                  {p.industryFit.strong?.map((s, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                      <p className="text-slate-300 font-medium">{s.area}</p>
                      {s.evidence && <p className="text-slate-500 mt-0.5">{s.evidence}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-red-400 mb-2">Needs Work</p>
                <div className="space-y-2">
                  {p.industryFit.weak?.map((w, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg border border-red-500/20 bg-red-500/5">
                      <p className="text-slate-300 font-medium">{w.area}</p>
                      {w.impact && <p className="text-slate-500 mt-0.5">{w.impact}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {p.industryFit.actionPlan?.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Action Plan to improve fit:</p>
                <div className="space-y-1.5">
                  {p.industryFit.actionPlan.map((action, i) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-300">
                      <span className="text-indigo-400 shrink-0">{i + 1}.</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Experience Gap */}
        {p.experienceGap?.length > 0 && (
          <div className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="text-white font-semibold text-sm">📊 Experience Gap</h3>
            <div className="space-y-3">
              {p.experienceGap.map((g, i) => (
                <div key={i} className="text-xs p-3 rounded-lg border border-white/5 bg-white/2 space-y-1.5">
                  <p className="text-slate-200 font-medium">{g.gap}</p>
                  {g.benchmark && (
                    <p className="text-slate-500">
                      <span className="text-slate-400">Benchmark: </span>
                      {g.benchmark}
                    </p>
                  )}
                  {g.suggestion && <p className="text-indigo-400">→ {g.suggestion}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewrite Examples */}
        {p.rewrite?.length > 0 && (
          <div className="rounded-xl border border-border p-4 space-y-4">
            <h3 className="text-white font-semibold text-sm">✏️ Rewrite Examples</h3>
            <div className="space-y-4">
              {p.rewrite.map((r, i) => (
                <div key={i} className="space-y-2">
                  {r.section && (
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{r.section}</p>
                  )}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-xs text-red-400 mb-1">Before</p>
                    <p className="text-xs text-slate-300">{r.before}</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-xs text-emerald-400 mb-1">After</p>
                    <p className="text-xs text-slate-300">{r.after}</p>
                  </div>
                  {r.why && (
                    <p className="text-xs text-slate-500 italic px-1">💡 {r.why}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function ResultSection({ result, onReset }) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">

      {/* Resume Profile */}
      <ResumeProfileCard profile={result.resumeProfile} />

      {/* Score Card */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-3">
        <ScoreCircle score={result.score} />
        <p className={`text-lg font-semibold ${scoreColor(result.score)}`}>
          {result.scoreLabel}
        </p>

        {(result.careerLevel || result.targetRole) && (
          <div className="flex gap-2 flex-wrap justify-center">
            {result.careerLevel && (
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                {result.careerLevel}
              </span>
            )}
            {result.targetRole && (
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                {result.targetRole}
              </span>
            )}
          </div>
        )}

        {result.benchmark && (
          <div className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-4 space-y-1 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">SEA Market Benchmark</p>
            <p className="text-white text-sm font-medium">{result.benchmark.position}</p>
            <p className="text-slate-400 text-xs">Expected range for your level: {result.benchmark.expectedRange}</p>
            <p className="text-slate-500 text-xs">{result.benchmark.context}</p>
          </div>
        )}

        {result.verdict && (
          <p className="text-slate-300 text-sm text-center max-w-md leading-relaxed border-t border-border pt-3 mt-1">
            {result.verdict}
          </p>
        )}
      </div>

      {/* Free Sections */}
      <div className="grid gap-4">
        <Section title="✅ Strengths" items={result.strengths} color="green" />
        <Section title="⚠️ Improvements Needed" items={result.improvements} color="red" />
        <Section title="💡 Actionable Tips" items={result.tips} color="blue" />
      </div>

      {/* Premium Section */}
      <PremiumSection result={result} />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl border border-border text-slate-300 hover:border-indigo-500/60 hover:text-white transition-colors text-sm font-medium"
        >
          Analyze Another Resume
        </button>
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-center transition-colors text-sm font-medium"
        >
          💬 Give Feedback
        </a>
      </div>

    </div>
  )
}