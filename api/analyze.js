import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const DAILY_FREE_LIMIT = 2

async function checkAndIncrementUsage(ip) {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('usage_logs')
    .select('count')
    .eq('ip', ip)
    .eq('date', today)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase check error:', error)
    return { allowed: true, count: 0 }
  }

  if (!data) {
    const { error: insertError } = await supabase
      .from('usage_logs')
      .insert([{ ip, date: today, count: 1 }])
    console.log('DEBUG insert result - error:', insertError)
    return { allowed: true, count: 1 }
  }

  if (data.count >= DAILY_FREE_LIMIT) {
    return { allowed: false, count: data.count }
  }

  await supabase
    .from('usage_logs')
    .update({ count: data.count + 1 })
    .eq('ip', ip)
    .eq('date', today)

  return { allowed: true, count: data.count + 1 }
}

async function validateToken(token) {
  if (!token) return false

  const { data, error } = await supabase
    .from('payment_tokens')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .single()

  if (error || !data) return false

  await supabase
    .from('payment_tokens')
    .update({ used: true })
    .eq('token', token)

  return true
}

const marketContext = `
SEA HIRING CONTEXT — Malaysia & Singapore

Fresh Graduate / Internship Benchmark: 65-75
Mid-level (2-5 years) Benchmark: 73-82
Senior / Specialist (5+ years) Benchmark: 80-90

Malaysia Market Intelligence:
- Fresh graduates need clear technical skills and GPA if above 3.5
- Personal projects and GitHub links significantly increase credibility
- Quantified achievements are highly valued (numbers, percentages, impact)
- Bilingual ability (English + Bahasa Malaysia) is a plus for local roles
- Key employers: Grab, AirAsia, Maybank, TM, Petronas, PwC, EY, CIMB

Singapore Market Intelligence:
- Concise one-page resume preferred for fresh graduates
- Impact-driven bullet points matter more than job descriptions
- Avoid overly academic language, focus on real-world contribution
- Internship experience at recognized companies carries strong weight
- Key employers: DBS, Shopee, Sea Group, ST Engineering, Deloitte, Singtel

Mid-level Hiring Expectations:
- Clear career progression and promotion history
- Team leadership or mentorship experience valued
- Quantified business impact required, not just responsibilities
- Industry certifications add credibility

Senior / Specialist Expectations:
- Strategic thinking and cross-functional leadership evidence
- P&L, budget, or organizational impact preferred
- Thought leadership, publications, or speaking engagements
- Executive presence in writing and presentation

Common Resume Weaknesses Across All Levels:
- No metrics or numbers to back up achievements
- Generic action verbs: did, helped, assisted, supported
- Skills listed without evidence of actual usage
- Summary section too vague or missing entirely
- Inconsistent formatting or tense usage

Strong Candidate Profile by Level:
Fresh Graduate:
- GPA 3.5+ or Dean's List mentioned
- At least one internship at a recognized company
- 2-3 personal or academic projects with measurable outcomes
- GitHub portfolio or portfolio link
- Clear target role in summary

Mid-level:
- Minimum 2-3 quantified achievements per role
- Evidence of team leadership or cross-functional work
- Certifications relevant to industry
- Clear career progression visible in timeline
- Impact stated in revenue, efficiency, or user metrics

Senior:
- Board-level or C-suite stakeholder management
- Budget or P&L ownership
- Thought leadership or industry recognition
- Team size and organizational scope clearly stated
- Strategic initiatives with measurable business outcomes

Career Transition Signals:
- Resume mentions transitioning, pivoting, or moving into a new field
- Current experience is in a different domain than target role
- Education is in a different field than work experience
- Skills mix spans two distinct industries or functions
- Summary explicitly states career change intention
`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { resumeText, careerLevel, targetRole, paymentToken } = req.body

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({ error: 'Resume text is too short or missing.' })
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'

  const tokenValid = await validateToken(paymentToken)

  if (!tokenValid) {
    const usage = await checkAndIncrementUsage(ip)
    if (!usage.allowed) {
      return res.status(429).json({
        error: 'limit_reached',
        message: 'You have used your 2 free analyses today. Unlock more for RM3.90.'
      })
    }
  }

  const level = careerLevel || 'Fresh Graduate'
  const role = targetRole || 'General'

  const prompt = `
You are an AI Career Intelligence Analyst and senior recruiter with 10+ years of hiring experience in Malaysia and Singapore.

${marketContext}

The candidate has selected:
Career Level: ${level}
Target Role: ${role}

STEP 1 — READ AND EXTRACT
Carefully read the entire resume. Extract all key information. This is the foundation for everything that follows.

STEP 2 — DETECT CAREER TRANSITION
Determine if this candidate is undergoing a career transition based on the Career Transition Signals above.
A transition exists when current/past experience is meaningfully different from the target role.
If transition detected, adjust your analysis to reflect a transitioning candidate, not a pure specialist.

STEP 3 — SCORE SEPARATELY
ATS Score: Pure technical assessment of format, keywords, structure, ATS-readiness.
Market Score: Real-world competitiveness for the target role considering experience, transition status, projects, achievements.
These two scores are separate and may differ significantly.

STEP 4 — ROLE FIT MATRIX
Based on the extracted profile, identify 4-6 roles this candidate is realistically suited for in SEA market.
Score each role honestly. Do not inflate scores.

STEP 5 — ANALYZE
Base every insight strictly on extracted features. Never fabricate.

Return ONLY this exact JSON structure, no markdown, no explanation:

{
  "careerLevel": "${level}",
  "targetRole": "${role}",
  "resumeProfile": {
    "summary": "<2-3 sentences: who is this person, their background, and honest career positioning>",
    "careerTransition": {
      "detected": <true | false>,
      "from": "<current/past domain if transition detected, else null>",
      "to": "<target domain if transition detected, else null>",
      "note": "<one sentence: honest assessment of transition readiness based on resume evidence>"
    },
    "extractedFeatures": {
      "education": "<degree, institution, GPA if mentioned>",
      "experience": "<list of roles and companies with duration>",
      "technicalSkills": ["<skill>"],
      "softSkills": ["<soft skill>"],
      "languages": ["<language>"],
      "projects": ["<project name and one-line description>"],
      "certifications": ["<certification if any>"],
      "notableAchievements": ["<quantified or standout achievement>"]
    }
  },
  "atsScore": <number 0-100>,
  "atsScoreLabel": "<Poor | Fair | Good | Excellent>",
  "atsNote": "<one sentence: explain what drives this ATS score specifically for this resume>",
  "marketScore": <number 0-100>,
  "marketScoreLabel": "<Poor | Fair | Good | Excellent>",
  "marketNote": "<one sentence: explain what drives this market competitiveness score>",
  "benchmark": {
    "expectedRange": "<range based on career level>",
    "position": "<one sentence: how this resume compares to typical candidates at this level>",
    "context": "<one sentence: career level + target role + market context>"
  },
  "verdict": "<2 sentences: honest overall assessment of competitiveness, accounting for transition status if applicable>",
  "strengths": [
    "<specific strength with direct evidence from resume>",
    "<specific strength with direct evidence from resume>",
    "<specific strength with direct evidence from resume>"
  ],
  "improvements": [
    "<specific issue with exact location + before/after example>",
    "<specific issue with exact location + before/after example>",
    "<specific issue with exact location + before/after example>"
  ],
  "tips": [
    "<actionable tip with before/after example>",
    "<actionable tip with before/after example>",
    "<actionable tip with before/after example>"
  ],
  "premium": {
    "roleFitMatrix": [
      { "role": "<role name>", "fitScore": <number 0-100>, "reason": "<one sentence why>", "gap": "<biggest gap for this role>" },
      { "role": "<role name>", "fitScore": <number 0-100>, "reason": "<one sentence why>", "gap": "<biggest gap for this role>" },
      { "role": "<role name>", "fitScore": <number 0-100>, "reason": "<one sentence why>", "gap": "<biggest gap for this role>" },
      { "role": "<role name>", "fitScore": <number 0-100>, "reason": "<one sentence why>", "gap": "<biggest gap for this role>" },
      { "role": "<role name>", "fitScore": <number 0-100>, "reason": "<one sentence why>", "gap": "<biggest gap for this role>" }
    ],
    "keywordIntelligence": {
      "detected": [
        { "keyword": "<keyword from resume>", "status": "<strong | weak>", "reason": "<why this matters for target role>" }
      ],
      "missing": [
        { "keyword": "<missing keyword>", "reason": "<why critical for target role in SEA>", "howToAdd": "<specific suggestion based on candidate background>" }
      ]
    },
    "industryFit": {
      "role": "${role}",
      "fitScore": <number 0-100>,
      "strong": [
        { "area": "<strong match area>", "evidence": "<direct reference from resume>" }
      ],
      "weak": [
        { "area": "<weak area>", "impact": "<how this affects hiring chances>" }
      ],
      "actionPlan": [
        "<specific action referencing candidate actual background>",
        "<specific action referencing candidate actual background>",
        "<specific action referencing candidate actual background>"
      ]
    },
    "experienceGap": [
      { "gap": "<specific gap>", "benchmark": "<what strong candidates at this level have>", "suggestion": "<specific suggestion>" },
      { "gap": "<specific gap>", "benchmark": "<benchmark>", "suggestion": "<suggestion>" },
      { "gap": "<specific gap>", "benchmark": "<benchmark>", "suggestion": "<suggestion>" },
      { "gap": "<specific gap>", "benchmark": "<benchmark>", "suggestion": "<suggestion>" },
      { "gap": "<specific gap>", "benchmark": "<benchmark>", "suggestion": "<suggestion>" }
    ],
    "projectQuality": {
      "assessment": "<academic | mixed | real-world>",
      "note": "<one sentence: honest assessment of project quality and commercial relevance>",
      "suggestions": [
        "<specific project idea relevant to candidate background and target role>",
        "<specific project idea relevant to candidate background and target role>",
        "<specific project idea relevant to candidate background and target role>"
      ]
    },
    "rewrite": [
      { "section": "<section name>", "before": "<exact quote from resume>", "after": "<rewritten version>", "why": "<why stronger>" },
      { "section": "<section name>", "before": "<exact quote from resume>", "after": "<rewritten version>", "why": "<why stronger>" },
      { "section": "<section name>", "before": "<exact quote from resume>", "after": "<rewritten version>", "why": "<why stronger>" }
    ]
  }
}

STRICT RULES:
- resumeProfile.summary must describe this specific person, not generic statements
- careerTransition.detected must be honest, not forced
- atsScore and marketScore must be calculated independently and may differ
- roleFitMatrix must reflect honest assessment, do not inflate scores
- projectQuality.assessment must distinguish academic from real-world honestly
- Every insight must trace back to extractedFeatures
- Never fabricate skills, companies, achievements not in resume
- rewrite before must be exact quotes from resume
- Write in clear English suitable for the career level

RESUME:
${resumeText.slice(0, 6000)}
`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenAI error:', data)
      return res.status(500).json({ error: 'OpenAI API error', detail: data.error?.message })
    }

    const raw = data.choices[0].message.content.trim()

    let parsed
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response', raw })
    }

    return res.status(200).json(parsed)

  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}