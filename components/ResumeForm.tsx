// components/ResumeForm.tsx
import { useState } from 'react'

export default function ResumeForm({
  onSubmit,
  loading,
}: {
  onSubmit: (resume: string, jobDesc: string) => void
  loading: boolean
}) {
  const [resume, setResume] = useState('')
  const [jobDesc, setJobDesc] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(resume, jobDesc)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <textarea
        placeholder="Paste your resume here..."
        className="w-full p-4 border rounded h-40"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        required
      />
      <textarea
        placeholder="Paste job description here..."
        className="w-full p-4 border rounded h-40"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Tailoring...' : 'Tailor Resume'}
      </button>
    </form>
  )
}
