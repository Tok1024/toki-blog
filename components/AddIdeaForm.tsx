'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddIdeaForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [mood, setMood] = useState('')
  const [token, setToken] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('ideas_token') ?? ''
  })
  const [status, setStatus] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ideas-token': token,
        },
        body: JSON.stringify({ title, text, mood }),
      })

      const data = await res.json()

      if (data.ok) {
        setStatus('ok')
        setTitle('')
        setText('')
        setMood('')
        // navigate back to the list page so user sees the new idea
        router.push('/ideas')
      } else {
        setStatus(data.error || 'error')
      }
    } catch (err) {
      setStatus(String(err))
    }
  }

  function saveToken() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideas_token', token)
      setStatus('token-saved')
    }
  }

  return (
    <div className="my-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 className="text-lg font-semibold">添加想法</h3>
      <p className="text-sm text-gray-500">
        只有你知道 token 时才能提交；将 token 存到 localStorage 可免重复输入。
      </p>

      <form id="add-idea" onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label htmlFor="ideas-token" className="sr-only">
            Token
          </label>
          <input
            id="ideas-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="secret token"
            className="w-full rounded-md border px-3 py-2"
          />

          <div className="mt-1 text-xs text-gray-500">
            <button type="button" onClick={saveToken} className="text-primary-600 underline">
              保存 token
            </button>
          </div>
        </div>

        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="内容"
            className="h-28 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="ideas-mood"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            心情（可选）
          </label>
          <select
            id="ideas-mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="">— 请选择 —</option>
            <option value="😄">😄 开心</option>
            <option value="🙂">🙂 放松</option>
            <option value="🤔">🤔 思考</option>
            <option value="😢">😢 难过</option>
            <option value="😡">😡 生气</option>
            <option value="🎉">🎉 兴奋</option>
            <option value="💡">💡 灵感</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-primary-600 inline-flex items-center rounded px-3 py-2 text-white"
          >
            提交
          </button>
          <div className="text-sm text-gray-600">{status}</div>
        </div>
      </form>
    </div>
  )
}
