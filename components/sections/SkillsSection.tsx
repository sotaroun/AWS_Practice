'use client'
import { useEffect, useRef, useState } from 'react'

type Skill = {
  id: string
  category: string
  name: string
  level: number
  description: string
}

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  default:  { bg: '#ede9fe', text: '#7c3aed', dot: '#7c3aed' },
  Frontend: { bg: '#e0f2fe', text: '#0369a1', dot: '#06b6d4' },
  Backend:  { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  Database: { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  DevOps:   { bg: '#fce7f3', text: '#9d174d', dot: '#ec4899' },
}

const levelLabel = ['', '入門', '基礎', '実践', '応用', '熟練']

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

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map(s => s.category))]
  const getColor = (cat: string) => categoryColors[cat] ?? categoryColors.default
  const { ref: headerRef, inView: headerInView } = useInView()
  const { ref: contentRef, inView: contentInView } = useInView(0.05)

  // パララックス背景用
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
    <section id="skills" ref={sectionRef}
      style={{ background: 'white', position: 'relative', overflow: 'hidden' }}>

      {/* パララックス背景装飾 */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        transform: `translateY(${bgY}px)`,
        transition: 'transform 0.05s linear',
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, #ede9fe 0%, transparent 70%)',
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-5%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, #e0f2fe 0%, transparent 70%)',
          opacity: 0.6,
        }} />
      </div>

      {/* グレー帯（固定・アニメなし） */}
      <div style={{ background: 'rgba(0,0,0,0.06)', position: 'relative', zIndex: 1 }}>
        <div className="max-w-3xl mx-auto px-6 py-3">
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5"
            style={{ color: '#7c3aed' }}>Skills</p>
<h2 className="text-4xl font-black" style={{ color: '#1e1b4b' }}>
            学習履歴・技術スタック
          </h2>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14" style={{ position: 'relative', zIndex: 1 }}>

        {/* 見出しフェードイン */}
        <div ref={headerRef} style={{
          marginBottom: '2rem',
          opacity: headerInView ? 1 : 0,
          transform: headerInView ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full"
              style={{ background: 'linear-gradient(#7c3aed, #06b6d4)' }} />
            <p className="text-lg font-black" style={{ color: '#1e1b4b' }}>
              習得中の技術スタック一覧
            </p>
          </div>
        </div>

        {categories.length === 0 && (
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            スキルがまだ登録されていません
          </p>
        )}

        <div ref={contentRef} className="space-y-8">
          {categories.map((category, ci) => {
            const color = getColor(category)
            return (
              <div key={category} style={{
                opacity: contentInView ? 1 : 0,
                transform: contentInView ? 'translateY(0)' : 'translateY(50px)',
                transition: `opacity 0.6s ease ${ci * 0.1}s, transform 0.6s ease ${ci * 0.1}s`,
              }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: color.dot }} />
                  <h3 className="text-sm font-black uppercase tracking-wide"
                    style={{ color: '#374151' }}>
                    {category}
                  </h3>
                  <div className="flex-1 h-px" style={{ background: '#f3f4f6' }} />
                  <span className="text-xs" style={{ color: '#9ca3af' }}>
                    {skills.filter(s => s.category === category).length}件
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  {skills.filter(s => s.category === category).map((skill, si) => (
                    <div key={skill.id}
                      className="flex items-center justify-between rounded-xl px-4 py-3
                        hover:shadow-sm transition-shadow"
                      style={{
                        background: '#fafafa',
                        border: `1.5px solid ${color.bg}`,
                        opacity: contentInView ? 1 : 0,
                        transform: contentInView ? 'translateX(0)' : 'translateX(-20px)',
                        transition: `opacity 0.5s ease ${ci * 0.1 + si * 0.05}s, transform 0.5s ease ${ci * 0.1 + si * 0.05}s`,
                      }}>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: '#1e1b4b' }}>
                          {skill.name}
                        </p>
                        {skill.description && (
                          <p className="text-xs mt-0.5 truncate" style={{ color: '#9ca3af' }}>
                            {skill.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-2 h-2 rounded-full"
                              style={{ background: i <= skill.level ? color.dot : '#e5e7eb' }} />
                          ))}
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: color.bg, color: color.text }}>
                          {levelLabel[skill.level]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}