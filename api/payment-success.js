import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { randomUUID } from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { sessionId } = req.body

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' })
    }

    const { data: existing } = await supabase
      .from('payment_tokens')
      .select('token')
      .eq('stripe_session_id', sessionId)
      .single()

    if (existing) {
      return res.status(200).json({ token: existing.token, email: session.customer_email })
    }

    const token = randomUUID()
    const email = session.customer_email

    await supabase.from('payment_tokens').insert([{
      token,
      email,
      stripe_session_id: sessionId,
      used: false,
    }])

    await resend.emails.send({
      from: 'AI Career Copilot <onboarding@resend.dev>',
      to: 'mkkopitiam2025@gmail.com',
      subject: 'Your Resume Analysis is Ready 🎯',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #f0f0f0; border-radius: 12px;">
          <h2 style="color: #4f8ef7; margin-bottom: 8px;">AI Career Copilot</h2>
          <p style="color: #888; font-size: 14px; margin-bottom: 24px;">Your payment was successful</p>

          <h3 style="font-size: 18px; margin-bottom: 12px;">You're all set! 🎉</h3>
          <p style="color: #ccc; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for your purchase. Click the button below to unlock your resume analysis.
            This link is valid for one analysis only.
          </p>

          <a href="${process.env.VITE_APP_URL || 'https://your-app.vercel.app'}?token=${token}"
            style="display: inline-block; background: #4f8ef7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Unlock My Analysis →
          </a>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #2a2a2a;">
            <p style="color: #555; font-size: 12px; line-height: 1.6;">
              <strong style="color: #888;">Order details:</strong><br/>
              Product: AI Resume Analysis (1 session)<br/>
              Amount: RM3.90<br/>
              Email: ${email}
            </p>
            <p style="color: #555; font-size: 12px; margin-top: 12px; line-height: 1.6;">
              This is a one-time purchase. No subscription. No auto-renewal.<br/>
              All sales are final. For support: ${process.env.CONTACT_EMAIL}
            </p>
          </div>
        </div>
      `
    })

    return res.status(200).json({ token, email })

  } catch (err) {
    console.error('Payment success error:', err)
    return res.status(500).json({ error: 'Failed to process payment' })
  }
}