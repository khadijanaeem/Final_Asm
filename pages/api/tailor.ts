// pages/api/tailor.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { triggerTailorAI } from '../../lib/n8nWebhook'
import { getCollections } from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { resume, jobDesc } = req.body

  try {
    const result = await triggerTailorAI(resume, jobDesc)
    const { resumes } = await getCollections()

    await resumes.insertOne({
      tailoredText: result.text || result.result || 'No result returned',
      jobTitle: jobDesc.slice(0, 100),
      createdAt: new Date(),
    })

    res.status(200).json({ result: result.text || result.result })
  } catch (error) {
    console.error('Tailor API failed:', error)
    res.status(500).json({ error: 'Failed to tailor resume' })
  }
}
