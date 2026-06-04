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
`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { resumeText, careerLevel, targetRole } = req.body

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({ error: 'Resume text is too short or missing.' })
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
Before doing any analysis, carefully read the entire resume and extract all key information. This extracted data must be the foundation for every analysis that follows. Do not fabricate or assume anything not present in the resume.

STEP 2 — ANALYZE
Based ONLY on the extracted features from Step 1, perform a thorough analysis.

Return ONLY this exact JSON structure, no markdown, no explanation:

{
  "careerLevel": "${level}",
  "targetRole": "${role}",

  "resumeProfile": {
    "summary": "<2-3 sentences describing who this person is, their background, and their overall career positioning based strictly on the resume content>",
    "extractedFeatures": {
      "education": "<degree, institution, GPA if mentioned>",
      "experience": "<list of roles and companies, with duration if available>",
      "technicalSkills": ["<skill 1>", "<skill 2>", "<skill 3>"],
      "softSkills": ["<soft skill 1>", "<soft skill 2>"],
      "languages": ["<language 1>", "<language 2>"],
      "projects": ["<project name and one-line description>"],
      "certifications": ["<certification if any>"],
      "notableAchievements": ["<any quantified or standout achievement found in resume>"]
    }
  },

  "score": <number 0-100>,
  "scoreLabel": "<Poor | Fair | Good | Excellent>",
  "benchmark": {
    "expectedRange": "<range based on career level>",
    "position": "<one sentence: how this resume compares to typical candidates at this level>",
    "context": "<one sentence: career level + target role + market context>"
  },
  "verdict": "<one strong sentence summarizing overall competitiveness for this specific role and market>",

  "strengths": [
    "<specific strength with direct evidence quoted from resume>",
    "<specific strength with direct evidence quoted from resume>",
    "<specific strength with direct evidence quoted from resume>"
  ],
  "improvements": [
    "<specific issue with exact location in resume + before/after example>",
    "<specific issue with exact location in resume + before/after example>",
    "<specific issue with exact location in resume + before/after example>"
  ],
  "tips": [
    "<actionable tip with before/after example>",
    "<actionable tip with before/after example>",
    "<actionable tip with before/after example>"
  ],

  "premium": {
    "keywordIntelligence": {
      "detected": [
        { "keyword": "<keyword found in extractedFeatures>", "status": "<strong | weak>", "reason": "<one sentence: why this keyword matters for the target role, based on candidate's actual usage>" }
      ],
      "missing": [
        { "keyword": "<missing keyword critical for target role>", "reason": "<one sentence: why this keyword is critical for the target role in SEA market>", "howToAdd": "<specific suggestion referencing candidate's actual experience on how to demonstrate this keyword>" }
      ]
    },
    "industryFit": {
      "role": "${role}",
      "fitScore": <number 0-100>,
      "strong": [
        { "area": "<strong match area based on extractedFeatures>", "evidence": "<direct quote or reference from resume>" }
      ],
      "weak": [
        { "area": "<weak area based on extractedFeatures>", "impact": "<one sentence: how this weakness affects hiring chances for target role>" }
      ],
      "actionPlan": [
        "<specific action referencing candidate's actual background to improve fit score>",
        "<specific action referencing candidate's actual background to improve fit score>",
        "<specific action referencing candidate's actual background to improve fit score>"
      ]
    },
    "experienceGap": [
      { "gap": "<specific gap identified from extractedFeatures>", "benchmark": "<what strong ${level} candidates typically have for ${role} roles>", "suggestion": "<specific actionable suggestion referencing candidate's actual experience>" },
      { "gap": "<specific gap identified from extractedFeatures>", "benchmark": "<what strong ${level} candidates typically have for ${role} roles>", "suggestion": "<specific actionable suggestion referencing candidate's actual experience>" },
      { "gap": "<specific gap identified from extractedFeatures>", "benchmark": "<what strong ${level} candidates typically have for ${role} roles>", "suggestion": "<specific actionable suggestion referencing candidate's actual experience>" },
      { "gap": "<specific gap identified from extractedFeatures>", "benchmark": "<what strong ${level} candidates typically have for ${role} roles>", "suggestion": "<specific actionable suggestion referencing candidate's actual experience>" },
      { "gap": "<specific gap identified from extractedFeatures>", "benchmark": "<what strong ${level} candidates typically have for ${role} roles>", "suggestion": "<specific actionable suggestion referencing candidate's actual experience>" }
    ],
    "rewrite": [
      {
        "section": "<which section this bullet point is from>",
        "before": "<exact weak bullet point quoted from resume>",
        "after": "<rewritten version: specific, quantified, ATS-optimized, based on candidate's actual context>",
        "why": "<one sentence: explain why this rewrite is stronger>"
      },
      {
        "section": "<which section this bullet point is from>",
        "before": "<exact weak bullet point quoted from resume>",
        "after": "<rewritten version: specific, quantified, ATS-optimized, based on candidate's actual context>",
        "why": "<one sentence: explain why this rewrite is stronger>"
      },
      {
        "section": "<which section this bullet point is from>",
        "before": "<exact weak bullet point quoted from resume>",
        "after": "<rewritten version: specific, quantified, ATS-optimized, based on candidate's actual context>",
        "why": "<one sentence: explain why this rewrite is stronger>"
      }
    ]
  }
}

STRICT RULES:
- resumeProfile.summary must describe this specific person based only on resume content, not generic statements
- extractedFeatures must only contain information actually present in the resume
- Every strength, improvement, tip, keyword, gap, and rewrite must trace back to extractedFeatures
- Never fabricate skills, companies, achievements, or qualifications not in the resume
- Benchmark range must match the career level selected
- Verdict must mention the target role and market
- Rewrite before must be exact quotes from the resume
- actionPlan must reference the candidate's actual background, not generic advice
- Write in clear English suitable for the career level selected

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
        max_tokens: 3500
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