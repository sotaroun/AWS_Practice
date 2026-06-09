'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import RichEditor from '@/components/editor/RichEditor'
import { Save } from 'lucide-react'

type Profile = {
  id: string
  name: string
  tagline: string
  bio: string
  github_url: string
  twitter_url: string
  avatar_url: string
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('profiles').select('*').limit(1).single()
      .then(({ data }) => { if (data) setProfile(data) })
  }, [])

  const save = async () => {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').upsert(profile)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return
    const path = `avatars/${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file)
    if (error) { alert('アップロード失敗'); return }
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
    setProfile({ ...profile, avatar_url: data.publicUrl })
  }

  if (!profile) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-4 animate-spin"
        style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
    </div>
  )

  const inputStyle = {
    background: '#f8f7ff',
    border: '2px solid #e5e7eb',
    color: '#1e1b4b',
    borderRadius: '12px',
    padding: '10px 16px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black" style={{ color: '#1e1b4b' }}>自己紹介編集</h2>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
            text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5
            disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
          <Save size={14} />
          {saved ? '✅ 保存しました！' : saving ? '保存中...' : '保存する'}
        </button>
      </div>

      <div className="rounded-3xl p-6 shadow-sm space-y-5"
        style={{ background: 'white', border: '1px solid #ede9fe' }}>

        {/* アバター */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: '#374151' }}>
            プロフィール画像
          </label>
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar"
                className="w-16 h-16 rounded-2xl object-cover shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: '#ede9fe' }}>👤</div>
            )}
            <label className="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold
              transition-all hover:opacity-80"
              style={{ background: '#ede9fe', color: '#7c3aed' }}>
              画像を選択
              <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>名前</label>
          <input value={profile.name}
            onChange={e => setProfile({...profile, name: e.target.value})}
            style={inputStyle} placeholder="山田 太郎" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>キャッチコピー</label>
          <input value={profile.tagline}
            onChange={e => setProfile({...profile, tagline: e.target.value})}
            style={inputStyle} placeholder="Web App Engineer（学習中）" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>自己紹介文</label>
          <RichEditor
            content={profile.bio}
            onChange={html => setProfile({...profile, bio: html})}
            placeholder="自己紹介を入力..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>GitHub URL</label>
          <input value={profile.github_url}
            onChange={e => setProfile({...profile, github_url: e.target.value})}
            style={inputStyle} placeholder="https://github.com/yourname" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Twitter / X URL</label>
          <input value={profile.twitter_url}
            onChange={e => setProfile({...profile, twitter_url: e.target.value})}
            style={inputStyle} placeholder="https://x.com/yourname" />
        </div>
      </div>
    </div>
  )
}