'use client'
import { useEffect, useState } from 'react'

type Profile = {
  name: string
  tagline: string
  bio: string
  github_url: string
  twitter_url: string
  avatar_url: string
}

export default function HeroSection({ profile }: { profile: Profile }) {
  const [mounted, setMounted] = useState(false)

useEffect(() => {
    // 初回表示アニメーション
    const timer = setTimeout(() => setMounted(true), 100)

    // タブを離れて戻ったときリセット→再アニメーション
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setMounted(false)
      } else {
        setTimeout(() => setMounted(true), 100)
      }
    }

    // 画面外スクロールでリセット（別セクションに行って戻ったとき）
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowH = window.innerHeight
      if (scrollY > windowH * 0.8) {
        // Heroが画面外に出たらリセット
        setMounted(false)
      } else if (scrollY < windowH * 0.2) {
        // Heroが画面内に戻ったら再発動
        setMounted(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const base = 'transition-all ease-out'

  // 各パーツのアニメーション定義
  const from = {
    top:    { opacity: 0, transform: 'translateY(-60px)' },
    bottom: { opacity: 0, transform: 'translateY(60px)' },
    left:   { opacity: 0, transform: 'translateX(-60px)' },
    right:  { opacity: 0, transform: 'translateX(60px)' },
    scale:  { opacity: 0, transform: 'scale(0.7)' },
  }
  const to = { opacity: 1, transform: 'none' }

  const anim = (
    dir: keyof typeof from,
    delay: number,
    duration = 700
  ) => ({
    style: mounted ? { ...to, transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }
                   : { ...from[dir], transitionDuration: `${duration}ms` },
    className: base,
  })

  return (
    <section className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #ede9fe 50%, #e0f2fe 100%)' }}>

      {/* 背景装飾（スケールで登場） */}
      <div {...anim('scale', 0, 1200)} style={{
        ...anim('scale', 0, 1200).style,
        position: 'absolute', top: '10%', left: '5%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, #ede9fe, transparent 70%)',
        opacity: mounted ? 0.5 : 0,
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div {...anim('scale', 200, 1200)} style={{
        ...anim('scale', 200, 1200).style,
        position: 'absolute', bottom: '10%', right: '5%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, #e0f2fe, transparent 70%)',
        opacity: mounted ? 0.5 : 0,
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* グレー帯 */}
      <div {...anim('top', 0)} style={{
        ...anim('top', 0).style,
        background: 'rgba(0,0,0,0.06)',
        position: 'relative', zIndex: 1,
      }}>
        <div className="max-w-3xl mx-auto px-6 py-3">
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5"
            style={{ color: '#7c3aed' }}>Profile</p>
          <h2 className="text-4xl font-black" style={{ color: '#1e1b4b' }}>自己紹介</h2>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative" style={{ zIndex: 1 }}>

        {/* アバター＋名前（左から） */}
        <div className={`flex items-center gap-6 mt-8 mb-6 ${base}`}
          style={mounted
            ? { ...to, transitionDuration: '700ms', transitionDelay: '150ms' }
            : { ...from.left, transitionDuration: '700ms' }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name}
              className="rounded-2xl object-cover shadow-lg shrink-0"
              style={{ width: '100px', height: '100px', border: '3px solid white' }} />
          ) : (
            <div className="rounded-2xl shrink-0 flex items-center justify-center
              text-3xl font-black text-white shadow-lg"
              style={{ width: '100px', height: '100px',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                border: '3px solid white' }}>
              {profile.name?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-black leading-tight"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {profile.name || 'Your Name'}
            </h1>
            <p className="text-sm font-medium mt-1" style={{ color: '#6b7280' }}>
              {profile.tagline || 'Web App Engineer（学習中）'}
            </p>
          </div>
        </div>

        {/* bio（下から） */}
        {profile.bio && (
          <div className={base}
            style={mounted
              ? { ...to, transitionDuration: '700ms', transitionDelay: '300ms' }
              : { ...from.bottom, transitionDuration: '700ms' }}>
            <div className="rounded-2xl px-5 py-4 mb-5 text-sm leading-relaxed shadow-sm"
              style={{ background: 'white', border: '1px solid #ede9fe', color: '#374151' }}
              dangerouslySetInnerHTML={{ __html: profile.bio }} />
          </div>
        )}

        {/* リンク（右から） */}
        <div className={`flex gap-2 flex-wrap pb-10 ${base}`}
          style={mounted
            ? { ...to, transitionDuration: '700ms', transitionDelay: '450ms' }
            : { ...from.right, transitionDuration: '700ms' }}>
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
              className="px-5 py-2 rounded-full text-sm font-bold shadow
                hover:shadow-md transition-all hover:-translate-y-0.5"
              style={{ background: 'white', color: '#1e1b4b', border: '2px solid #1e1b4b' }}>
              GitHub →
            </a>
          )}
          {profile.twitter_url && (
            <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
              className="px-5 py-2 rounded-full text-sm font-bold text-white shadow
                hover:shadow-md transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              Twitter / X →
            </a>
          )}
        </div>
      </div>
    </section>
  )
}