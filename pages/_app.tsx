// pages/_app.tsx
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '@/lib/supabaseClient'  // adjust path if different

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          router.push('/dashboard') // redirect after login
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  return <Component {...pageProps} />
}
