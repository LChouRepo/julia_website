import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, 'content')

async function readJSON(filePath: string) {
  const raw = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(raw)
}

export async function readSettings() {
  try {
    const p = path.join(CONTENT_DIR, 'settings.json')
    const data = await readJSON(p)
    return data
  } catch {
    return null
  }
}

async function listJSON(dir: string) {
  try {
    const entries = await fs.readdir(dir)
    const files = entries.filter((f) => f.endsWith('.json'))
    const results = await Promise.all(files.map((f) => readJSON(path.join(dir, f))))
    return results
  } catch {
    return []
  }
}

export async function readEvents() {
  return listJSON(path.join(CONTENT_DIR, 'events'))
}

export async function readReleases() {
  return listJSON(path.join(CONTENT_DIR, 'releases'))
}

export async function readQuotes() {
  return listJSON(path.join(CONTENT_DIR, 'quotes'))
}
