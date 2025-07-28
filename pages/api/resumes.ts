// pages/api/resumes.ts
import formidable from 'formidable'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import { getCollections } from '@/lib/mongodb'
import { triggerTailorAI } from '@/lib/triggerAI'

import type { NextApiRequest, NextApiResponse } from 'next'
export const config = {
  api: {
    bodyParser: false,
  },
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { resumes } = await getCollections()

  if (req.method === 'POST') {
    try {
      console.log('[POST /api/resumes] Starting request')

      const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
        const form = formidable({ multiples: false })
        form.parse(req, (err, fields, files) => {
          if (err) reject(err)
          else resolve({ fields, files })
        })
      })

      const jobDesc = fields.jobDesc?.[0]
      const uploadedFile = files.resume?.[0]
      console.log('Parsed form data:', { jobDesc, uploadedFile })

      if (!jobDesc || !uploadedFile) {
        return res.status(400).json({ message: 'Missing job description or resume file' })
      }

      const fileBuffer = fs.readFileSync(uploadedFile.filepath)
      const pdfData = await pdfParse(fileBuffer)
      const extractedResumeText = pdfData.text

      console.log('Extracted Resume Text Length:', extractedResumeText.length)

      const aiResult = await triggerTailorAI(extractedResumeText, jobDesc)
      console.log('AI Response:', aiResult)

      if (!aiResult || !aiResult.tailoredResume) {
        throw new Error('AI did not return a tailoredResume')
      }

      const result = await resumes.insertOne({
        jobDesc,
        tailoredResume: aiResult.tailoredResume,
        createdAt: new Date(),
      })

      console.log('Insert Result:', result)
      return res.status(201).json({ message: 'Success', id: result.insertedId })

    } catch (err: any) {
      console.error('[POST /api/resumes] Error:', err)
      return res.status(500).json({ message: err?.message || 'Unknown error' })
    }
  }

  if (req.method === 'GET') {
    const all = await resumes.find().sort({ createdAt: -1 }).toArray()
    return res.status(200).json(all)
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}

