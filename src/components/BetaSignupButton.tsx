import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window { turnstile: any }
}

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string

export default function BetaSignupButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 rounded-2xl bg-accent text-white hover:bg-accent/90 transition-colors font-medium shadow-lg hover:shadow-xl"
      >
        Sign up for the beta test
      </button>
      {open && <BetaSignupModal onClose={() => setOpen(false)} />}
    </>
  )
}

function BetaSignupModal({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const widgetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.onload = () => {
      if (widgetRef.current) {
        window.turnstile.render(widgetRef.current, {
          sitekey: siteKey,
          callback: (t: string) => setToken(t)
        })
      }
    }
    document.body.appendChild(script)
    return () => { 
      if (document.body.contains(script)) {
        document.body.removeChild(script) 
      }
    }
  }, [])

  async function submit() {
    if (!email || !token) return
    setLoading(true)
    try {
      const res = await fetch('/functions/v1/beta-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName || undefined,
          email,
          phone: phone || undefined,
          turnstileToken: token,
          source: 'landing_about'
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      alert(data.duplicate ? 'You are already on the list' : 'You are on the list')
      onClose()
    } catch (e: any) {
      alert(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-terminal-card border border-terminal-border p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Join the beta</h3>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Full name"
            className="w-full rounded-xl border border-terminal-border bg-terminal-bg text-foreground p-3 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-xl border border-terminal-border bg-terminal-bg text-foreground p-3 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full rounded-xl border border-terminal-border bg-terminal-bg text-foreground p-3 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div ref={widgetRef} className="my-4 flex justify-center" />
          <button
            onClick={submit}
            disabled={loading || !email || !token}
            className="w-full rounded-2xl bg-accent text-white py-3 disabled:opacity-50 hover:bg-accent/90 transition-colors font-medium"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Quick sign up. We use this to invite real users only.
          </p>
        </div>
      </div>
    </div>
  )
}
