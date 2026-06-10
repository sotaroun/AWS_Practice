'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // ページビュー追跡
    analytics.pageView(pathname)
  }, [pathname])

  useEffect(() => {
    // スクロール追跡
    let lastScrollPercent = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      
      // 25%刻みでトラッキング
      if (scrollPercent >= lastScrollPercent + 25 && scrollPercent <= 100) {
        analytics.scroll(scrollPercent)
        lastScrollPercent = scrollPercent
      }
    }

    // クリック追跡
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const className = target.className
      const id = target.id
      const text = target.textContent?.slice(0, 50) || ''

      analytics.click(`${tagName}${id ? `#${id}` : ''}${className ? `.${className}` : ''}`, {
        text,
        x: e.clientX,
        y: e.clientY
      })
    }

    // イベントリスナー追加
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick)

    // クリーンアップ
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null // UIは表示しない
}

