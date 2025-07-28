import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'
import styles from '../styles/Dashboard.module.css'

type ResumeEntry = {
  _id: string
  jobTitle: string
  tailoredResume: string
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [resumes, setResumes] = useState<ResumeEntry[]>([])
  const [loading, setLoading] = useState(true)

  const [jobDesc, setJobDesc] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    const getUserData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log("SESSION DATA", session)
    console.log("SESSION ERROR", error)

      if (!session || error) {
        setTimeout(() => router.push('/login'), 500)
        return
      }
      setEmail(session.user.email || '')
      await fetchResumes()
      setLoading(false)
    }
    getUserData()
  }, [router])

  const fetchResumes = async () => {
  try {
    const res = await fetch('/api/resumes')
    const text = await res.text()
    console.log("Resume fetch response:", text)

    if (!res.ok) {
      throw new Error(text)
    }

    const data = JSON.parse(text)
    setResumes(data)
  } catch (err) {
    console.error("Resume fetch failed:", err)
  }
}

  const downloadResume = (resume: ResumeEntry) => {
    const blob = new Blob([resume.tailoredResume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.jobTitle.replace(/\s+/g, '_')}_resume.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!jobDesc.trim() || !resumeFile) {
      setFormError('Please provide a job description and upload a resume PDF.')
      return
    }

    setFormLoading(true)
    try {
      const formData = new FormData()
      formData.append('jobDesc', jobDesc)
      formData.append('resume', resumeFile)

      const res = await fetch('/api/resumes', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to process resume.')
      }

      setJobDesc('')
      setResumeFile(null)
      await fetchResumes()
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) return <p className={styles.container}>Loading...</p>

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome, {email}</h1>

      <section>
        <h2 className={styles.subheading}>Upload Resume PDF</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <label htmlFor="jobDesc" className={styles.label}>Job Description</label>
            <textarea
              id="jobDesc"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className={styles.textarea}
              required
              disabled={formLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="resumeFile" className={styles.label}>Upload Resume PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className={styles.input}
              disabled={formLoading}
            />
          </div>

          {formError && <p className={styles.error}>{formError}</p>}

          <button type="submit" className={styles.button} disabled={formLoading}>
            {formLoading ? 'Uploading...' : 'Upload and Tailor'}
          </button>
        </form>
      </section>

      <hr className={styles.divider} />

      <section>
        <h2 className={styles.subheading}>Your Tailored Resumes</h2>
        {resumes.length === 0 ? (
          <p>No resumes found.</p>
        ) : (
          <ul className={styles.resumeList}>
            {resumes.map((resume) => (
              <li key={resume._id} className={styles.resumeItem}>
                <p><strong>{resume.jobTitle}</strong></p>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  Created at: {new Date(resume.createdAt).toLocaleString()}
                </p>
                <div className={styles.resumeText}>{resume.tailoredResume}</div>
                <button onClick={() => downloadResume(resume)} className={styles.button}>
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
