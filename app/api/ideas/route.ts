import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

function validToken(req: Request) {
  const token = req.headers.get('x-ideas-token') || ''
  const expected = process.env.IDEAS_PASSWORD || ''
  return expected !== '' && token === expected
}

export async function POST(req: Request) {
  try {
    if (!validToken(req)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized: missing or invalid token' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { title, text, mood } = body || {}
    if (!title || !text) {
      return NextResponse.json({ ok: false, error: 'Missing title or text' }, { status: 400 })
    }
    const file = path.join(process.cwd(), 'private', 'ideas.json')
    const raw = await fs.readFile(file, 'utf-8').catch(() => '[]')
    const list = JSON.parse(raw)
    const item = {
      id: new Date().toISOString(),
      title: String(title),
      text: String(text),
      date: new Date().toISOString(),
      mood: mood ? String(mood) : '',
    }
    list.unshift(item)
    await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf-8')
    // return the updated list so clients can refresh immediately
    return NextResponse.json({ ok: true, item, list })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const file = path.join(process.cwd(), 'private', 'ideas.json')
    const raw = await fs.readFile(file, 'utf-8').catch(() => '[]')
    const list = JSON.parse(raw)
    return NextResponse.json({ ok: true, list })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
