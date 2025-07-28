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
const Blobs = () => (
  <div className={styles.blobContainer}>
    <svg className={styles.blob} viewBox="0 0 200 200">
      <path fill="#93c5fd" d="M47.6,-52.4C59.6,-38.2,66.6,-19.1,65.3,-1.3C64,16.4,54.5,32.9,42.5,47.2C30.4,61.5,15.2,73.7,-1.5,75.3C-18.1,76.8,-36.3,67.7,-51.6,54.1C-66.9,40.6,-79.4,22.3,-78.2,4.6C-77.1,-13.1,-62.4,-29.1,-47.8,-44.1C-33.3,-59.2,-16.7,-73.2,0.5,-73.7C17.7,-74.2,35.3,-61.7,47.6,-52.4Z" transform="translate(100 100)" />
    </svg>
    <svg className={`${styles.blob} ${styles.blob2}`} viewBox="0 0 200 200">
      <path fill="#bfdbfe" d="M37.6,-48.4C49.6,-36.2,60.6,-24.6,66.2,-9.9C71.8,4.8,72.1,23.5,63.8,36.5C55.6,49.4,38.8,56.6,21.5,61.1C4.2,65.5,-13.6,67.3,-27.1,60.6C-40.6,53.9,-49.8,38.8,-58.2,22.3C-66.5,5.9,-73.9,-12,-68.7,-25.3C-63.5,-38.5,-45.7,-47,-29.2,-56.8C-12.7,-66.7,2.5,-77.8,16.7,-74.3C30.9,-70.8,43.3,-52.9,37.6,-48.4Z" transform="translate(100 100)" />
    </svg>
  </div>
)

  return (
    <div className={styles.container}>
      <Blobs/>
      <div>className={styles.glass}

      <h1 className={styles.heading}>SkillSync</h1>

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
            
      </div>
  )
}
