'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import AdminProfile from '@/components/admin/AdminProfile'
import AdminSkills from '@/components/admin/AdminSkills'
import AdminWorks from '@/components/admin/AdminWorks'
import { LogOut, User, Code2, Briefcase } from 'lucide-react'

type Tab = 'profile' | 'skills' | 'works'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('profile')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
      else setChecking(false)
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#f8f7ff' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent mx-auto mb-3 animate-spin"
            style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
          <p style={{ color: '#6b7280' }}>読み込み中...</p>
        </div>
      </div>
    )
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: '自己紹介', icon: <User size={15} /> },
    { key: 'skills',  label: 'スキル',   icon: <Code2 size={15} /> },
    { key: 'works',   label: '制作物',   icon: <Briefcase size={15} /> },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f8f7ff' }}>
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 shadow-sm"
        style={{ background: 'white', borderBottom: '1px solid #ede9fe' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              ✏️
            </div>
            <h1 className="font-black text-lg" style={{ color: '#1e1b4b' }}>管理画面</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank"
              className="text-sm font-medium px-4 py-1.5 rounded-full transition-all hover:opacity-80"
              style={{ background: '#ede9fe', color: '#7c3aed' }}>
              サイトを見る →
            </a>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: '#6b7280' }}>
              <LogOut size={14} />ログアウト
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* タブ */}
        <div className="flex gap-2 mb-8 p-1.5 rounded-2xl w-fit shadow-sm"
          style={{ background: 'white', border: '1px solid #ede9fe' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                transition-all"
              style={tab === t.key
                ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: 'white' }
                : { color: '#6b7280' }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* コンテンツ */}
        {tab === 'profile' && <AdminProfile />}
        {tab === 'skills'  && <AdminSkills />}
        {tab === 'works'   && <AdminWorks />}
      </div>
    </div>
  )
}