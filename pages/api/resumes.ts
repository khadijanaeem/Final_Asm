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
      const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
        const form = formidable({ multiples: false })
        form.parse(req, (err, fields, files) => {
          if (err) reject(err)
          else resolve({ fields, files })
        })
      })

      const jobDesc = fields.jobDesc?.[0]
      const uploadedFile = files.resume?.[0]

      if (!jobDesc || !uploadedFile) {
        res.status(400).json({ message: 'Missing job description or resume file' })
        return
      }

      const fileBuffer = fs.readFileSync(uploadedFile.filepath)
      const pdfData = await pdfParse(fileBuffer)
      const extractedResumeText = pdfData.text

      const aiResult = await triggerTailorAI(extractedResumeText, jobDesc)

      const result = await resumes.insertOne({
         userEmail: session.user.email,
        jobDesc: jobDesc,
        tailoredResume: aiResult.tailoredResume,
        createdAt: new Date(),
      })

      res.status(201).json({ message: 'Success', id: result.insertedId })
    } catch (err) {
      console.error('[POST /api/resumes]', err)
      res.status(500).json({ message: 'Error processing request' })
    }
    return // ✅ Important to end here
  }

  if (req.method === 'GET') {
    const all = await resumes.find().sort({ createdAt: -1 }).toArray()
    res.status(200).json(all)
    return
  }

  res.status(405).json({ message: 'Method Not Allowed' })
}
