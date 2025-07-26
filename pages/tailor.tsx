// pages/tailor.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'
import ResumeForm from '../components/ResumeForm'
import TailoredResult from '../components/TailoredResult'

export default function TailorPage() {
  const router = useRouter()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [tailoredText, setTailoredText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setSessionChecked(true)
    })
  }, [router])

  const handleSubmit = async (resume: string, jobDesc: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDesc }),
      })
      const data = await res.json()
      setTailoredText(data.result)
    } catch (e) {
      console.error('Tailor failed', e)
    } finally {
      setLoading(false)
    }
  }

  if (!sessionChecked) return null

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🧠 AI Resume Tailoring</h1>
      <ResumeForm onSubmit={handleSubmit} loading={loading} />
      {tailoredText && <TailoredResult result={tailoredText} />}
    </div>
  )
}
