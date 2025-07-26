export async function triggerTailorAI(resume: string, jobDesc: string) {
  const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobDesc }),
  })
  if (!response.ok) throw new Error('AI tailoring failed.')

  return await response.json()
}


