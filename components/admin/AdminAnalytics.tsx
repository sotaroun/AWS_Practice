
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BarChart3, Users, Eye, MousePointer, Clock, Activity, TrendingUp, Globe } from 'lucide-react'

type AnalyticsData = {
  id: number
  session_id: string
  event_type: string
  page_url: string
  user_agent: string
  data: any
  created_at: string
}

type Stats = {
  totalEvents: number
  uniqueSessions: number
  pageViews: number
  clicks: number
  scrollEvents: number
}

type PageStats = {
  page: string
  views: number
  percentage: number
}

export default function AdminAnalytics() {
  const [realtimeData, setRealtimeData] = useState<AnalyticsData[]>([])
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    uniqueSessions: 0,
    pageViews: 0,
    clicks: 0,
    scrollEvents: 0
  })
  const [pageStats, setPageStats] = useState<PageStats[]>([])
  const [timeRange, setTimeRange] = useState('24h')
  const [isLive, setIsLive] = useState(false)

  // 統計データ取得
  const fetchStats = async () => {
    const hoursAgo = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720
    const { data } = await supabase
      .from('analytics')
      .select('*')
      .gte('created_at', new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString())

    if (data) {
      const uniqueSessions = new Set(data.map(d => d.session_id)).size
      const pageViews = data.filter(d => d.event_type === 'page_view').length
      const clicks = data.filter(d => d.event_type === 'click').length
      const scrollEvents = data.filter(d => d.event_type === 'scroll').length

      setStats({
        totalEvents: data.length,
        uniqueSessions,
        pageViews,
        clicks,
        scrollEvents
      })

      // ページ別統計
      const pageViewData = data.filter(d => d.event_type === 'page_view')
      const pageCounts: { [key: string]: number } = {}
      
      pageViewData.forEach(d => {
        const path = new URL(d.page_url).pathname
        pageCounts[path] = (pageCounts[path] || 0) + 1
      })

      const totalPageViews = Object.values(pageCounts).reduce((sum, count) => sum + count, 0)
      const pageStatsArray = Object.entries(pageCounts)
        .map(([page, views]) => ({
          page,
          views,
          percentage: Math.round((views / totalPageViews) * 100)
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)

      setPageStats(pageStatsArray)
    }
  }

useEffect(() => {
  fetchStats()

  // リアルタイム更新
  const channel = supabase
    .channel('analytics_realtime')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'analytics' },
      (payload) => {
        setRealtimeData(prev => [payload.new as AnalyticsData, ...prev.slice(0, 49)])
        setIsLive(true)
        fetchStats()
        
        setTimeout(() => setIsLive(false), 3000)
      }
    )
    .subscribe()

  // 初期データ取得
  supabase
    .from('analytics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
    .then(({ data }) => {
      if (data) setRealtimeData(data)
    })

  // クリーンアップ関数を修正
  return () => {
    supabase.removeChannel(channel)
  }
}, [timeRange])


  // イベントタイプ別の色分け
  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'page_view': return 'bg-blue-100 text-blue-800'
      case 'click': return 'bg-green-100 text-green-800'
      case 'scroll': return 'bg-purple-100 text-purple-800'
      case 'form_submit': return 'bg-orange-100 text-orange-800'
      case 'setup_test': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1e1b4b' }}>
            リアルタイム分析
          </h2>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            サイトの利用状況をリアルタイムで確認できます
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            isLive ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium">{isLive ? 'LIVE' : '待機中'}</span>
          </div>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm"
            style={{ borderColor: '#ede9fe' }}
          >
            <option value="24h">過去24時間</option>
            <option value="7d">過去7日</option>
            <option value="30d">過去30日</option>
          </select>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#ede9fe' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>総イベント数</p>
              <p className="text-2xl font-bold" style={{ color: '#7c3aed' }}>{stats.totalEvents}</p>
            </div>
            <BarChart3 className="w-8 h-8" style={{ color: '#7c3aed' }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#ede9fe' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>ユニーク訪問者</p>
              <p className="text-2xl font-bold" style={{ color: '#059669' }}>{stats.uniqueSessions}</p>
            </div>
            <Users className="w-8 h-8" style={{ color: '#059669' }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#ede9fe' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>ページビュー</p>
              <p className="text-2xl font-bold" style={{ color: '#0284c7' }}>{stats.pageViews}</p>
            </div>
            <Eye className="w-8 h-8" style={{ color: '#0284c7' }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#ede9fe' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>クリック数</p>
              <p className="text-2xl font-bold" style={{ color: '#ea580c' }}>{stats.clicks}</p>
            </div>
            <MousePointer className="w-8 h-8" style={{ color: '#ea580c' }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#ede9fe' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>スクロール</p>
              <p className="text-2xl font-bold" style={{ color: '#7c2d12' }}>{stats.scrollEvents}</p>
            </div>
            <Activity className="w-8 h-8" style={{ color: '#7c2d12' }} />
          </div>
        </div>
      </div>

      {/* ページ別統計とリアルタイムフィード */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 人気ページ */}
        <div className="bg-white rounded-xl shadow-sm border" style={{ borderColor: '#ede9fe' }}>
          <div className="p-4 border-b" style={{ borderColor: '#ede9fe' }}>
            <h3 className="text-lg font-semibold flex items-center" style={{ color: '#1e1b4b' }}>
              <TrendingUp className="w-5 h-5 mr-2" />
              人気ページ
            </h3>
          </div>
          <div className="p-4">
            {pageStats.length === 0 ? (
              <div className="text-center py-8" style={{ color: '#6b7280' }}>
                <Globe className="w-12 h-12 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                <p>データがありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pageStats.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: '#ede9fe', color: '#7c3aed' }}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#1e1b4b' }}>
                        {page.page === '/' ? 'ホーム' : page.page}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold" style={{ color: '#7c3aed' }}>
                        {page.views}
                      </span>
                      <span className="text-xs" style={{ color: '#6b7280' }}>
                        ({page.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* リアルタイムイベントフィード */}
        <div className="bg-white rounded-xl shadow-sm border" style={{ borderColor: '#ede9fe' }}>
          <div className="p-4 border-b" style={{ borderColor: '#ede9fe' }}>
            <h3 className="text-lg font-semibold flex items-center" style={{ color: '#1e1b4b' }}>
              <Clock className="w-5 h-5 mr-2" />
              リアルタイムイベント
            </h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {realtimeData.length === 0 ? (
              <div className="p-8 text-center" style={{ color: '#6b7280' }}>
                <Activity className="w-12 h-12 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                <p>イベントを待機中...</p>
                <p className="text-sm">サイトを操作するとリアルタイムで表示されます</p>
              </div>
            ) : (
              realtimeData.slice(0, 10).map((event) => (
                <div key={event.id} className="p-3 border-b hover:bg-gray-50 transition-colors" 
                  style={{ borderColor: '#f3f4f6' }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getEventColor(event.event_type)}`}>
                          {event.event_type}
                        </span>
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          {new Date(event.created_at).toLocaleTimeString('ja-JP')}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#1e1b4b' }}>
                        {new URL(event.page_url).pathname}
                      </p>
                      {event.data && Object.keys(event.data).length > 0 && (
                        <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                          {JSON.stringify(event.data).slice(0, 50)}...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

