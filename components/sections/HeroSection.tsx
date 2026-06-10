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
    setMounted(true)
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setMounted(false)
      } else {
        setTimeout(() => setMounted(true), 100)
      }
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowH = window.innerHeight
      if (scrollY > windowH * 0.8) {
        setMounted(false)
      } else if (scrollY < windowH * 0.2) {
        setMounted(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 固定のスタイル定義
  const baseStyle = {
    transition: 'all 700ms ease-out'
  }

  const getAnimationStyle = (direction: string, delay: number) => {
    const transforms = {
      top: 'translateY(-60px)',
      bottom: 'translateY(60px)', 
      left: 'translateX(-60px)',
      right: 'translateX(60px)',
      scale: 'scale(0.7)'
    }

    return {
      ...baseStyle,
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'none' : transforms[direction as keyof typeof transforms],
      transitionDelay: `${delay}ms`
    }
  }

  return (
    <section 
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #ede9fe 50%, #e0f2fe 100%)' }}
    >
      {/* 背景装飾 */}
      <div 
        style={{
          ...getAnimationStyle('scale', 0),
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ede9fe, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transitionDuration: '1200ms'
        }}
      />
      
      <div 
        style={{
          ...getAnimationStyle('scale', 200),
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #e0f2fe, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transitionDuration: '1200ms'
        }}
      />

      {/* ヘッダー部分 */}
      <div 
        style={{
          ...getAnimationStyle('top', 0),
          background: 'rgba(0,0,0,0.06)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3">
          <p 
            className="text-xs font-bold uppercase tracking-widest mb-0.5"
            style={{ color: '#7c3aed' }}
          >
            Profile
          </p>
          <h2 
            className="text-4xl font-black"
            style={{ color: '#1e1b4b' }}
          >
            自己紹介
          </h2>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative" style={{ zIndex: 1 }}>
        {/* プロフィール部分 */}
        <div 
          className="flex items-center gap-6 mt-8 mb-6"
          style={getAnimationStyle('left', 150)}
        >
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url}
              alt={profile.name || 'Profile'}
              className="rounded-2xl object-cover shadow-lg"
              style={{ 
                width: '100px', 
                height: '100px', 
                border: '3px solid white',
                flexShrink: 0
              }}
            />
          ) : (
            <div 
              className="rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg"
              style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                border: '3px solid white',
                flexShrink: 0
              }}
            >
              {profile.name?.charAt(0) || '?'}
            </div>
          )}
          
          <div>
            <h1 
              className="text-4xl font-black leading-tight"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {profile.name || 'Your Name'}
            </h1>
            <p 
              className="text-sm font-medium mt-1"
              style={{ color: '#6b7280' }}
            >
              {profile.tagline || 'Web App Engineer（学習中）'}
            </p>
          </div>
        </div>

        {/* Bio部分 */}
        {profile.bio && (
          <div style={getAnimationStyle('bottom', 300)}>
            <div 
              className="rounded-2xl px-5 py-4 mb-5 text-sm leading-relaxed shadow-sm"
              style={{
                background: 'white',
                border: '1px solid #ede9fe',
                color: '#374151'
              }}
              dangerouslySetInnerHTML={{ __html: profile.bio }}
            />
          </div>
        )}

        {/* リンク部分 */}
        <div 
          className="flex gap-2 flex-wrap pb-10"
          style={getAnimationStyle('right', 450)}
        >
          {profile.github_url && (
            <a 
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full text-sm font-bold shadow hover:shadow-md transition-all hover:-translate-y-0.5"
              style={{
                background: 'white',
                color: '#1e1b4b',
                border: '2px solid #1e1b4b'
              }}
            >
              GitHub →
            </a>
          )}
          
          {profile.twitter_url && (
            <a 
              href={profile.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full text-sm font-bold text-white shadow hover:shadow-md transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)'
              }}
            >
              Twitter / X →
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
