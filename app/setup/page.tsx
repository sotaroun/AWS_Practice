'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SetupPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const setupAnalytics = async () => {
    setLoading(true)
    setStatus('Analytics テーブルをセットアップ中...')

    try {
      // 1. analyticsテーブル作成
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS analytics (
            id SERIAL PRIMARY KEY,
            session_id VARCHAR(36),
            event_type VARCHAR(50) NOT NULL,
            page_url VARCHAR(500),
            user_agent TEXT,
            referrer VARCHAR(500),
            data JSONB,
            created_at TIMESTAMP DEFAULT NOW()
          );
        `
      })

      if (createError) {
        // 直接テーブル作成を試行
        const { error: directError } = await supabase
          .from('analytics')
          .select('id')
          .limit(1)

        if (directError && directError.code === '42P01') {
          // テーブルが存在しない場合、手動で作成
          setStatus('手動でテーブル作成を試行中...')
          
          // 代替方法：既存のテーブル構造を利用
          const { error: insertError } = await supabase
            .from('profiles') // 既存のテーブルを使用してスキーマ確認
            .select('id')
            .limit(1)

          if (!insertError) {
            setStatus('✅ Supabase接続確認完了。手動でテーブル作成が必要です。')
          }
        }
      } else {
        setStatus('✅ Analytics テーブル作成完了！')
      }

      // 2. テストデータ挿入
      const testData = {
        session_id: 'setup-test-' + Date.now(),
        event_type: 'setup_test',
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        data: { setup: true, timestamp: new Date().toISOString() }
      }

      const { error: insertError } = await supabase
        .from('analytics')
        .insert(testData)

      if (!insertError) {
        setStatus(prev => prev + '\n✅ テストデータ挿入完了！')
      } else {
        setStatus(prev => prev + '\n⚠️ テストデータ挿入失敗: ' + insertError.message)
      }

    } catch (error) {
      setStatus('❌ エラー: ' + (error as Error).message)
    }

    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics Setup</h1>
      
      <div className="space-y-4">
        <button
          onClick={setupAnalytics}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'セットアップ中...' : 'Analytics テーブルをセットアップ'}
        </button>

        {status && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{status}</pre>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800">手動セットアップが必要な場合：</h3>
        <p className="text-sm text-yellow-700 mt-2">
          Supabaseダッシュボード → SQL Editor で以下を実行してください：
        </p>
        <pre className="text-xs bg-white p-2 mt-2 rounded border overflow-x-auto">
{`CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(36),
  event_type VARCHAR(50) NOT NULL,
  page_url VARCHAR(500),
  user_agent TEXT,
  referrer VARCHAR(500),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert analytics" ON analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view analytics" ON analytics
  FOR SELECT USING (true);`}
        </pre>
      </div>
    </div>
  )
}
