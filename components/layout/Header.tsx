'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  HomeIcon, 
  UserIcon, 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: 'プロフィール', href: '/profile', icon: UserIcon },
  { name: 'プロジェクト', href: '/projects', icon: BriefcaseIcon },
  { name: 'お問い合わせ', href: '/contact', icon: ChatBubbleLeftRightIcon },
  { name: '管理画面', href: '/admin', icon: ChartBarIcon },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* ロゴ - サイズを50pxに調整 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div style={{ width: 50, height: 50 }} className="bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Portfolio</span>
            </Link>
          </div>

          {/* デスクトップナビゲーション - アイコンサイズを調整 */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon style={{ width: 20, height: 20, flexShrink: 0 }} />

                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* モバイルメニューボタン - サイズを調整 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-purple-600 p-2 rounded-md"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* モバイルメニュー - アイコンサイズを調整 */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon style={{ width: 20, height: 20, flexShrink: 0 }} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
