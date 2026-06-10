-- ==========================================
-- Analytics System Setup for Supabase
-- ==========================================

-- 1. analyticsテーブル作成
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

-- 2. インデックス作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);

-- 3. Row Level Security有効化
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 4. 既存のポリシーを削除（もしあれば）
DROP POLICY IF EXISTS "Admin can view analytics" ON analytics;
DROP POLICY IF EXISTS "Public can insert analytics" ON analytics;

-- 5. 新しいポリシー作成
-- 管理者（認証済みユーザー）は全データを閲覧可能
CREATE POLICY "Admin can view analytics" ON analytics
  FOR SELECT USING (true);

-- 誰でもanalyticsデータを挿入可能（トラッキング用）
CREATE POLICY "Public can insert analytics" ON analytics
  FOR INSERT WITH CHECK (true);

-- 6. テストデータ挿入（動作確認用）
INSERT INTO analytics (session_id, event_type, page_url, user_agent, data) VALUES
  ('test-session-1', 'page_view', 'http://3.113.247.203/', 'Test Browser', '{"page": "/"}'),
  ('test-session-1', 'click', 'http://3.113.247.203/', 'Test Browser', '{"element": "button", "text": "テストボタン"}'),
  ('test-session-2', 'page_view', 'http://3.113.247.203/admin', 'Test Browser', '{"page": "/admin"}');

-- 7. 作成確認
SELECT 'Analytics table created successfully!' as status;
SELECT COUNT(*) as test_records_count FROM analytics;
