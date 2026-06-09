'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import RichEditor from '@/components/editor/RichEditor'
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react'

type Work = {
  id: string
  title: string
  description: string
  tech_stack: string[]
  site_url: string
  github_url: string
  thumbnail_url: string
  sort_order: number
}

const emptyWork = (): Work => ({
  id: crypto.randomUUID(),
  title: '',
  description: '',
  tech_stack: [],
  site_url: '',
  github_url: '',
  thumbnail_url: '',
  sort_order: 0,
})

export default function AdminWorks() {
  const [works, setWorks] = useState<Work[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('works').select('*').order('sort_order')
      .then(({ data }) => {
        if (data) {
          setWorks(data)
          if (data.length > 0) setOpenId(data[0].id)
        }
      })
  }, [])

  const add = () => {
    const w = { ...emptyWork(), sort_order: works.length }
    setWorks([...works, w])
    setOpenId(w.id)
  }
  const remove = (id: string) => {
    setWorks(works.filter(w => w.id !== id))
    setOpenId(null)
  }
  const update = (id: string, key: keyof Work, value: string | string[]) =>
    setWorks(works.map(w => w.id === id ? { ...w, [key]: value } : w))

  const uploadThumbnail = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl
    await new Promise<void>(resolve => { img.onload = () => resolve() })
    const MAX = 880
    let { width, height } = img
    if (width > MAX || height > MAX) {
      if (width > height) { height = Math.round(height * MAX / width); width = MAX }
      else { width = Math.round(width * MAX / height); height = MAX }
    }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
    URL.revokeObjectURL(objectUrl)
    const blob = await new Promise<Blob>(resolve =>
      canvas.toBlob(b => resolve(b!), 'image/webp', 0.85))
    const path = `works/${Date.now()}.webp`
    const { error } = await supabase.storage.from('portfolio-images').upload(path, blob)
    if (error) { alert('アップロード失敗'); return }
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
    update(id, 'thumbnail_url', data.publicUrl)
  }

  const save = async () => {
    setSaving(true)
    await supabase.from('works').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('works').insert(works.map((w, i) => ({ ...w, sort_order: i })))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = {
    background: '#f8f7ff',
    border: '2px solid #e5e7eb',
    color: '#1e1b4b',
    borderRadius: '10px',
    padding: '8px 12px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
  }

  const label = (text: string) => (
    <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#9ca3af' }}>
      {text}
    </p>
  )

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between pb-3"
        style={{ borderBottom: '2px solid #ede9fe' }}>
        <div>
          <h2 className="text-xl font-black" style={{ color: '#1e1b4b' }}>制作物</h2>
          <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
            {works.length}件登録済み
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={add}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{ background: '#e0f2fe', color: '#0369a1' }}>
            <Plus size={13} />追加
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <Save size={13} />
            {saved ? '✅ 保存完了' : saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>

      {works.length === 0 && (
        <div className="text-center py-12 rounded-2xl"
          style={{ border: '2px dashed #7dd3fc', color: '#9ca3af' }}>
          <p className="text-3xl mb-2">🚀</p>
          <p className="text-sm font-medium">「追加」ボタンで制作物を追加できます</p>
        </div>
      )}

      {/* アコーディオンリスト */}
      <div className="space-y-2">
        {works.map((work, i) => {
          const isOpen = openId === work.id
          return (
            <div key={work.id} className="rounded-2xl overflow-hidden shadow-sm"
              style={{ border: isOpen ? '2px solid #c4b5fd' : '2px solid #e5e7eb', background: 'white' }}>

              {/* アコーディオンヘッダー */}
              <button type="button"
                className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:opacity-80"
                style={{ background: isOpen ? '#faf5ff' : 'white' }}
                onClick={() => setOpenId(isOpen ? null : work.id)}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#ede9fe', color: '#7c3aed' }}>
                    #{i + 1}
                  </span>
                  <span className="font-bold text-sm" style={{ color: '#1e1b4b' }}>
                    {work.title || '（タイトル未入力）'}
                  </span>
                  {work.tech_stack?.length > 0 && (
                    <span className="text-xs" style={{ color: '#9ca3af' }}>
                      {work.tech_stack.slice(0, 2).join(' · ')}
                      {work.tech_stack.length > 2 && ` +${work.tech_stack.length - 2}`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isOpen && (
                    <button type="button" onClick={e => { e.stopPropagation(); remove(work.id) }}
                      className="text-xs px-2 py-1 rounded-lg font-medium transition-all hover:opacity-80"
                      style={{ background: '#fef2f2', color: '#ef4444' }}>
                      削除
                    </button>
                  )}
                  {isOpen ? <ChevronUp size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
                </div>
              </button>

              {/* アコーディオン中身 */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-4"
                  style={{ borderTop: '1px solid #ede9fe' }}>

                  {/* タイトル */}
                  <div className="pt-4">
                    {label('タイトル')}
                    <input value={work.title}
                      onChange={e => update(work.id, 'title', e.target.value)}
                      style={inputStyle} placeholder="作品名を入力" />
                  </div>

                  {/* URL 2列 */}
                  <div>
                    {label('リンク')}
                    <div className="grid grid-cols-2 gap-2">
                      <input value={work.site_url}
                        onChange={e => update(work.id, 'site_url', e.target.value)}
                        style={{ ...inputStyle }}
                        placeholder="🌐 サイトURL" />
                      <input value={work.github_url}
                        onChange={e => update(work.id, 'github_url', e.target.value)}
                        style={{ ...inputStyle }}
                        placeholder="🐙 GitHub URL" />
                    </div>
                  </div>

                  {/* 使用技術 */}
                  <div>
                    {label('使用技術（カンマ区切り）')}
                    <input
                      value={work.tech_stack?.join(', ')}
                      onChange={e => update(work.id, 'tech_stack',
                        e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      style={inputStyle}
                      placeholder="Next.js, Supabase, Vercel" />
                    {work.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {work.tech_stack.map((tech, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: '#ede9fe', color: '#7c3aed' }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* サムネイル */}
                  <div>
                    {label('サムネイル')}
                    <div className="flex items-center gap-3">
                      {work.thumbnail_url ? (
                        <div className="relative shrink-0">
                          <img src={work.thumbnail_url} alt="thumbnail"
                            className="object-cover rounded-xl shadow-sm"
                            style={{ width: '80px', height: '52px' }} />
                          <button type="button"
                            onClick={() => update(work.id, 'thumbnail_url', '')}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white
                              flex items-center justify-center shadow text-xs"
                            style={{ background: '#ef4444', fontSize: '10px' }}>
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ width: '80px', height: '52px', background: '#f0fdf4', border: '2px dashed #bbf7d0' }}>
                          🖼️
                        </div>
                      )}
                      <label className="cursor-pointer px-3 py-2 rounded-xl text-xs font-bold
                        transition-all hover:opacity-80"
                        style={{ background: '#e0f2fe', color: '#0369a1' }}>
                        {work.thumbnail_url ? '変更' : '画像を追加'}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => uploadThumbnail(work.id, e)} />
                      </label>
                    </div>
                  </div>

                  {/* 説明文 */}
                  <div>
                    {label('説明文')}
                    <RichEditor
                      content={work.description}
                      onChange={html => update(work.id, 'description', html)}
                      placeholder="作品の説明を入力..." />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}