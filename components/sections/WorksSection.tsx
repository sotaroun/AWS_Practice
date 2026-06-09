'use client'
import { useEffect, useRef, useState } from 'react'

type Work = {
  id: string
  title: string
  description: string
  tech_stack: string[]
  site_url: string
  github_url: string
  thumbnail_url: string
}

const tagColors = [
  { bg: '#ede9fe', text: '#7c3aed' },
  { bg: '#e0f2fe', text: '#0369a1' },
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#dcfce7', text: '#166534' },
  { bg: '#fce7f3', text: '#9d174d' },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 入ったときON、出たときOFF → スクロールするたびに再発動
        setInView(entry.isIntersecting)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

export default function WorksSection({ works }: { works: Work[] }) {
  const { ref: headerRef, inView: headerInView } = useInView()
  const sectionRef = useRef<HTMLElement>(null)
  const [bgY, setBgY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      setBgY(rect.top * 0.08)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="works" ref={sectionRef}
      style={{ background: '#f8f7ff', position: 'relative', overflow: 'hidden' }}>

      {/* パララックス背景装飾 */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        transform: `translateY(${bgY}px)`,
        transition: 'transform 0.05s linear',
      }}>
        <div style={{
          position: 'absolute', top: '5%', left: '10%',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, #e0f2fe 0%, transparent 70%)',
          opacity: 0.8,
        }} />
        <div style={{
          position: 'absolute', bottom: '0%', right: '5%',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, #ede9fe 0%, transparent 70%)',
          opacity: 0.7,
        }} />
      </div>

      {/* グレー帯（固定・アニメなし） */}
      <div style={{ background: 'rgba(0,0,0,0.06)', position: 'relative', zIndex: 1 }}>
        <div className="max-w-3xl mx-auto px-6 py-3">
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5"
            style={{ color: '#06b6d4' }}>Works</p>
          <h2 className="text-4xl font-black" style={{ color: '#1e1b4b' }}>
            制作物・プロジェクト
          </h2>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14" style={{ position: 'relative', zIndex: 1 }}>

        {/* 見出しスライドイン */}
        <div ref={headerRef} style={{
          marginBottom: '2rem',
          opacity: headerInView ? 1 : 0,
          transform: headerInView ? 'translateX(0)' : 'translateX(-50px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full"
              style={{ background: 'linear-gradient(#06b6d4, #7c3aed)' }} />
            <p className="text-lg font-black" style={{ color: '#1e1b4b' }}>
              これまでに作ったもの
            </p>
          </div>
        </div>

        {works.length === 0 && (
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            制作物がまだ登録されていません
          </p>
        )}

        <div className="space-y-4">
          {works.map((work, i) => {
            const { ref: cardRef, inView: cardInView } = useInView(0.1)
            return (
              <div key={work.id} ref={cardRef}
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md
                  transition-shadow duration-200"
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  opacity: cardInView ? 1 : 0,
                  transform: cardInView
                    ? 'translateY(0) scale(1)'
                    : 'translateY(40px) scale(0.97)',
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                }}>
                <div className="flex">
                  <div className="shrink-0" style={{ width: '140px' }}>
                    {work.thumbnail_url ? (
                      <img src={work.thumbnail_url} alt={work.title}
                        className="w-full h-full object-cover"
                        style={{ minHeight: '110px' }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl"
                        style={{ minHeight: '110px',
                          background: 'linear-gradient(135deg, #ede9fe, #e0f2fe)' }}>
                        🚀
                      </div>
                    )}
                  </div>
                  <div className="flex-1 px-4 py-3 min-w-0">
                    <h3 className="font-black text-base mb-1" style={{ color: '#1e1b4b' }}>
                      {work.title}
                    </h3>
                    {work.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {work.tech_stack.map((tech, ti) => {
                          const c = tagColors[ti % tagColors.length]
                          return (
                            <span key={tech}
                              className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: c.bg, color: c.text }}>
                              {tech}
                            </span>
                          )
                        })}
                      </div>
                    )}
                    <div className="text-xs leading-relaxed mb-3"
                      style={{ color: '#6b7280' }}
                      dangerouslySetInnerHTML={{ __html: work.description }} />

                    <div className="flex gap-2">
                      {work.site_url && (
                        <a href={work.site_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg font-bold text-white
                            transition-all hover:opacity-80"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                          サイトを見る →
                        </a>
                      )}
                      {work.github_url && (
                        <a href={work.github_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg font-bold
                            transition-all hover:opacity-80"
                          style={{ background: '#f3f4f6', color: '#374151' }}>
                          GitHub →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}