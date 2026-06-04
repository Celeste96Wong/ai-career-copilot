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

function ScoreCircle({ score, label }) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#2a2d3a" strokeWidth="8" />
        <circle
          cx="55" cy="55" r={radius} fill="none"
          className={scoreRing(score)}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="55" y="55" textAnchor="middle" dominantBaseline="central"
          fill="white" fontSize="22" fontWeight="700" fontFamily="Inter">
          {score}
        </text>
      </svg>
      <p className={`text-xs font-semibold ${scoreColor(score)}`}>{label}</p>
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
  const t = profile.careerTransition

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Resume Profile</p>
        <p className="text-slate-300 text-sm leading-relaxed">{profile.summary}</p>
      </div>

      {t?.detected && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
          <p className="text-xs text-amber-400 font-medium mb-1">
            🔄 Career Transition Detected: {t.from} → {t.to}
          </p>
          <p className="text-xs text-slate-400">{t.note}</p>
        </div>
      )}

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
                  <span className="text-indigo-400 shrink-0">→</span>{p}
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
                  <span className="text-emerald-400 shrink-0">★</span>{a}
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

function ScoreCard({ result }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">

      {/* Dual Score */}
      <div className="flex justify-around items-center">
        <div className="text-center">
          <ScoreCircle score={result.atsScore} label="ATS Score" />
          <p className={`text-xs mt-1 ${scoreColor(result.atsScore)}`}>{result.atsScoreLabel}</p>
          {result.atsNote && (
            <p className="text-xs text-slate-500 mt-1 max-w-[140px] text-center leading-relaxed">{result.atsNote}</p>
          )}
        </div>

        <div className="h-20 w-px bg-border" />

        <div className="text-center">
          <ScoreCircle score={result.marketScore} label="Market Score" />
          <p className={`text-xs mt-1 ${scoreColor(result.marketScore)}`}>{result.marketScoreLabel}</p>
          {result.marketNote && (
            <p className="text-xs text-slate-500 mt-1 max-w-[140px] text-center leading-relaxed">{result.marketNote}</p>
          )}
        </div>
      </div>

      {/* Tags */}
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

      {/* Benchmark */}
      {result.benchmark && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider">SEA Market Benchmark</p>
          <p className="text-white text-sm font-medium">{result.benchmark.position}</p>
          <p className="text-slate-400 text-xs">Expected range: {result.benchmark.expectedRange}</p>
          <p className="text-slate-500 text-xs">{result.benchmark.context}</p>
        </div>
      )}

      {/* Verdict */}
      {result.verdict && (
        <p className="text-slate-300 text-sm text-center leading-relaxed border-t border-border pt-3">
          {result.verdict}
        </p>
      )}
    </div>
  )
}

function PremiumSection({ result }) {
  const p = result.premium
  if (!p) return null

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="p-5 space-y-5">

        {/* Role Fit Matrix */}
        {p.roleFitMatrix?.length > 0 && (
          <div className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="text-white font-semibold text-sm">🎯 Role Fit Matrix</h3>
            <p className="text-xs text-slate-500">Based on your profile, here are your realistic role matches in SEA market:</p>
            <div className="space-y-3">
              {p.roleFitMatrix
                .sort((a, b) => b.fitScore - a.fitScore)
                .map((r, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 font-medium">{r.role}</span>
                    <span className={`text-sm font-semibold ${scoreColor(r.fitScore)}`}>{r.fitScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        r.fitScore >= 80 ? 'bg-emerald-400' :
                        r.fitScore >= 60 ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`}
                      style={{ width: `${r.fitScore}%` }}
                    />
                  </div>
                  <div className="flex gap-4">
                    {r.reason && <p className="text-xs text-slate-500 flex-1">{r.reason}</p>}
                    {r.gap && <p className="text-xs text-red-400 flex-1">Gap: {r.gap}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <h3 className="text-white font-semibold text-sm">📊 Industry Fit — {p.industryFit.role}</h3>
              <span className={`text-xl font-bold ${scoreColor(p.industryFit.fitScore)}`}>
                {p.industryFit.fitScore}%
              </span>
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
                <p className="text-xs text-slate-400 mb-2">Action Plan:</p>
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
            <h3 className="text-white font-semibold text-sm">📋 Experience Gap</h3>
            <div className="space-y-3">
              {p.experienceGap.map((g, i) => (
                <div key={i} className="text-xs p-3 rounded-lg border border-white/5 bg-white/2 space-y-1.5">
                  <p className="text-slate-200 font-medium">{g.gap}</p>
                  {g.benchmark && (
                    <p className="text-slate-500">
                      <span className="text-slate-400">Benchmark: </span>{g.benchmark}
                    </p>
                  )}
                  {g.suggestion && <p className="text-indigo-400">→ {g.suggestion}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Quality */}
        {p.projectQuality && (
          <div className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">🔬 Project Quality</h3>
              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                p.projectQuality.assessment === 'real-world'
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                  : p.projectQuality.assessment === 'mixed'
                  ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                  : 'border-red-500/30 text-red-400 bg-red-500/10'
              }`}>
                {p.projectQuality.assessment}
              </span>
            </div>
            {p.projectQuality.note && (
              <p className="text-xs text-slate-400">{p.projectQuality.note}</p>
            )}
            {p.projectQuality.suggestions?.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Suggested projects to strengthen your profile:</p>
                <div className="space-y-1.5">
                  {p.projectQuality.suggestions.map((s, i) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-300">
                      <span className="text-indigo-400 shrink-0">→</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      <ResumeProfileCard profile={result.resumeProfile} />
      <ScoreCard result={result} />

      <div className="grid gap-4">
        <Section title="✅ Strengths" items={result.strengths} color="green" />
        <Section title="⚠️ Improvements Needed" items={result.improvements} color="red" />
        <Section title="💡 Actionable Tips" items={result.tips} color="blue" />
      </div>

      <PremiumSection result={result} />

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