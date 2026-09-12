import { MongoClient, type Collection, type Db, type Document } from 'mongodb'

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017'
const dbName = process.env.MONGODB_DB ?? 'projectos'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectDb() {
  if (db) return db
  client = new MongoClient(uri)
  await client.connect()
  db = client.db(dbName)
  return db
}

export function col<T extends Document>(name: string): Collection<T> {
  if (!db) throw new Error('Database is not connected')
  return db.collection<T>(name)
}
