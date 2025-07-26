import { useState } from 'react'
import supabase from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import styles from '../styles/Login.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
      setTimeout(() => router.replace('/dashboard'), 3000)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login via Magic Link</h1>

        {sent ? (
          <p className={styles.message}>📩 Check your email for the magic link!</p>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              autoFocus
            />
            <button type="submit" className={styles.button}>
              Send Magic Link
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
