import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'
import styles from '../styles/Resumes.module.css'

type ResumeEntry = {
  _id: string
  jobTitle: string
  tailoredResume: string
  createdAt: string
}

export default function ResumesPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<ResumeEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const res = await fetch('/api/resumes')
      const data = await res.json()
      setResumes(data)
      setLoading(false)
    }

    fetchData()
  }, [router])

  const downloadResume = (resume: ResumeEntry) => {
    const blob = new Blob([resume.tailoredResume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.jobTitle.replace(/\s+/g, '_')}_resume.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p className={styles.loading}>Loading...</p>

  return (
    <div className={styles.page}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.heading}>Your Tailored Resumes</h1>
        {resumes.length === 0 ? (
          <p>No resumes found.</p>
        ) : (
          <ul className={styles.resumeList}>
            {resumes.map((resume) => (
              <li key={resume._id} className={styles.resumeItem}>
                <p><strong>{resume.jobTitle}</strong></p>
                <p className={styles.timestamp}>
                  Created at: {new Date(resume.createdAt).toLocaleString()}
                </p>
                <pre className={styles.resumeText}>{resume.tailoredResume}</pre>
                <button
                  onClick={() => downloadResume(resume)}
                  className={styles.button}
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
