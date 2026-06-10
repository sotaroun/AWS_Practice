import { supabase } from '@/lib/supabase'

// セッションIDを生成・管理
const getSessionId = (): string => {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// イベント送信関数
export const trackEvent = async (
  eventType: string, 
  data: Record<string, any> = {}
) => {
  if (typeof window === 'undefined') return

  try {
    await supabase.from('analytics').insert({
      session_id: getSessionId(),
      event_type: eventType,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      data: data
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
  }
}

// 便利な関数群
export const analytics = {
  // ページビュー
  pageView: (page?: string) => trackEvent('page_view', { 
    page: page || window.location.pathname 
  }),
  
  // クリックイベント
  click: (element: string, data?: Record<string, any>) => 
    trackEvent('click', { element, ...data }),
  
  // スクロール
  scroll: (percent: number) => trackEvent('scroll', { percent }),
  
  // フォーム送信
  formSubmit: (formName: string, data?: Record<string, any>) => 
    trackEvent('form_submit', { form_name: formName, ...data }),
  
  // カスタムイベント
  custom: (eventName: string, data?: Record<string, any>) => 
    trackEvent('custom', { event_name: eventName, ...data })
}
