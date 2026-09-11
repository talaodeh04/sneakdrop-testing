import { useState } from 'react'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()

    if (!isValidEmail(email)) {
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (!res.ok) {
        throw new Error('Newsletter subscription failed')
      }

      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (status !== 'idle') setStatus('idle')
        }}
        placeholder="you@email.com"
        aria-label="Email address"
      />

      <button
        className="btn"
        type="submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending…' : 'Notify me'}
      </button>

      {status === 'error' && (
        <p className="form-msg form-msg-error">
          That email doesn't look right.
        </p>
      )}

      {status === 'success' && (
        <p className="form-msg form-msg-success">
          You're on the list for the next drop.
        </p>
      )}
    </form>
  )
}