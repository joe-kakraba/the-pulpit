import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function NewsletterForm({ content }) {
  const c = content || {}
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() })

    if (error) {
      if (error.code === '23505') {
        setStatus('success')
        setMessage("You're already on the list.")
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } else {
      setStatus('success')
      setMessage("You're in. Watch your inbox.")
      setEmail('')
    }
  }

  return (
    <div className="newsletter-box">
      <h2 className="section-title" style={{ marginBottom: 6 }}>
        {c.headline || 'Get a new message in your inbox'}
      </h2>
      {c.subtext && <p style={{ color: 'var(--text-mid)' }}>{c.subtext}</p>}
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Joining...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <div className={`form-msg ${status === 'error' ? 'error' : 'success'}`}>{message}</div>
      )}
    </div>
  )
}
