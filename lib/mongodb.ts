// lib/mongodb.ts
import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGO_URI) {
  throw new Error('MONGODB_URI is not defined in .env.local')
}

const uri = process.env.MONGO_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri!, options)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db('resume_db')
}

export async function getCollections() {
  const db = await getDatabase()
  return {
    resumes: db.collection('resumes'),
    jobDescriptions: db.collection('job_descriptions'),
  }
}
