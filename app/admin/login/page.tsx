'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('メールアドレスまたはパスワードが間違っています')
      setLoading(false)
      return
    }
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #ede9fe 50%, #e0f2fe 100%)' }}>

      {/* 背景デコレーション */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: '#7c3aed' }} />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ background: '#06b6d4' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center
            text-2xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            🔐
          </div>
          <h1 className="text-3xl font-black" style={{ color: '#1e1b4b' }}>管理画面</h1>
          <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>ログインしてください</p>
        </div>

        <form onSubmit={handleLogin}
          className="rounded-3xl p-8 shadow-xl space-y-5"
          style={{ background: 'white', border: '1px solid #ede9fe' }}>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: '#f8f7ff',
                border: '2px solid #e5e7eb',
                color: '#1e1b4b',
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: '#f8f7ff',
                border: '2px solid #e5e7eb',
                color: '#1e1b4b',
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm font-medium"
              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white shadow-md
              hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50
              disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            {loading ? 'ログイン中...' : 'ログイン →'}
          </button>
        </form>
      </div>
    </div>
  )
}