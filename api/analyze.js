export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { resumeText } = req.body

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({ error: 'Resume text is too short or missing.' })
  }

  const prompt = `
You are an expert ATS resume reviewer and career coach.

Analyze the following resume and return a JSON response with this exact structure:
{
  "score": <number 0-100>,
  "scoreLabel": "<Poor | Fair | Good | Excellent>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<issue 1>", "<issue 2>", "<issue 3>"],
  "tips": ["<actionable tip 1>", "<actionable tip 2>", "<actionable tip 3>"]
}

Scoring criteria:
- Skills relevance and keyword density (25%)
- Structure and formatting clarity (25%)
- Experience quality and quantified achievements (25%)
- Summary and professional presentation (25%)

Be specific, honest, and actionable. Tailor feedback for the Southeast Asian job market (Malaysia/Singapore).

Return ONLY the JSON object. No markdown, no explanation.

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
        max_tokens: 800
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
      parsed = JSON.parse(raw)
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response', raw })
    }

    return res.status(200).json(parsed)

  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}