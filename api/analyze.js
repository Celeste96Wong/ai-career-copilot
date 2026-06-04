const recruiterContext = `
RECRUITER KNOWLEDGE BASE:

Malaysia Market:
- Fresh graduates need clear technical skills and GPA if above 3.5
- Personal projects and GitHub links significantly increase credibility
- Quantified achievements are highly valued (numbers, percentages, impact)
- Bilingual ability (English + Bahasa Malaysia) is a plus for local roles
- Common hiring companies: Grab, AirAsia, Maybank, TM, Petronas, PwC, EY

Singapore Market:
- Concise one-page resume preferred for fresh graduates
- Impact-driven bullet points matter more than job descriptions
- Avoid overly academic language — focus on real-world contribution
- Internship experience at recognized companies carries strong weight
- Common hiring companies: DBS, Shopee, Sea Group, ST Engineering, Deloitte

Common Resume Weaknesses:
- No metrics or numbers to back up achievements
- Generic action verbs (did, helped, assisted) instead of strong ones (built, led, reduced, improved)
- Skills listed without evidence of actual usage
- Summary section too vague or missing entirely
- Inconsistent formatting or tense usage

ATS Benchmark:
- Fresh graduate average: 55-65/100
- Competitive candidate: 70-80/100
- Strong candidate: 85+/100
`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { resumeText } = req.body

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({ error: 'Resume text is too short or missing.' })
  }

  const prompt = `
You are an AI Career Intelligence Analyst and senior recruiter with 10+ years of hiring experience in Malaysia and Singapore.

${recruiterContext}

Evaluate this resume across these dimensions:
- ATS compatibility and keyword density (40%)
- Experience quality and quantified achievements (25%)
- Skills relevance and evidence of usage (20%)
- Professional communication and presentation (15%)

STRICT RULES:
- Every piece of feedback must reference specific evidence from the resume.
- Do not give generic advice. If you say "add metrics", show exactly where.
- Tailor all feedback specifically for the Malaysia/Singapore job market.
- Compare against the benchmark scores provided above.
- Never fabricate information not present in the resume.

Return ONLY this JSON structure, no markdown, no explanation:
{
  "score": <number 0-100>,
  "scoreLabel": "<Poor | Fair | Good | Excellent>",
  "benchmark": "<how this resume compares to typical candidates>",
  "strengths": ["<specific strength with resume evidence>", "<specific strength>", "<specific strength>"],
  "improvements": ["<specific issue with exact location in resume>", "<specific issue>", "<specific issue>"],
  "tips": ["<actionable tip with before/after example>", "<actionable tip>", "<actionable tip>"]
}

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
        max_tokens: 1000
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