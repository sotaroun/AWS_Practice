'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Save } from 'lucide-react'

type Skill = {
  id: string
  category: string
  name: string
  level: number
  description: string
  sort_order: number
}

const emptySkill = (): Skill => ({
  id: crypto.randomUUID(),
  category: '',
  name: '',
  level: 3,
  description: '',
  sort_order: 0,
})

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('skills').select('*').order('sort_order')
      .then(({ data }) => { if (data) setSkills(data) })
  }, [])

  const add = () => setSkills([...skills, { ...emptySkill(), sort_order: skills.length }])
  const remove = (id: string) => setSkills(skills.filter(s => s.id !== id))
  const update = (id: string, key: keyof Skill, value: string | number) =>
    setSkills(skills.map(s => s.id === id ? { ...s, [key]: value } : s))

  const save = async () => {
    setSaving(true)
    await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('skills').insert(skills.map((s, i) => ({ ...s, sort_order: i })))
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black" style={{ color: '#1e1b4b' }}>スキル編集</h2>
        <div className="flex gap-2">
          <button onClick={add}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
              transition-all hover:opacity-80"
            style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <Plus size={14} />追加
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
              text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5
              disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <Save size={14} />
            {saved ? '✅ 保存しました！' : saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>

      {skills.length === 0 && (
        <div className="text-center py-16 rounded-3xl"
          style={{ border: '2px dashed #c4b5fd', color: '#9ca3af' }}>
          <p className="text-4xl mb-3">💡</p>
          <p className="font-medium">「追加」ボタンでスキルを追加できます</p>
        </div>
      )}

      <div className="space-y-3">
        {skills.map(skill => (
          <div key={skill.id} className="rounded-2xl p-5 shadow-sm space-y-4"
            style={{ background: 'white', border: '1px solid #ede9fe' }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#6b7280' }}>カテゴリ</label>
                <input value={skill.category}
                  onChange={e => update(skill.id, 'category', e.target.value)}
                  style={inputStyle} placeholder="例: Frontend" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#6b7280' }}>スキル名</label>
                <input value={skill.name}
                  onChange={e => update(skill.id, 'name', e.target.value)}
                  style={inputStyle} placeholder="例: React" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#6b7280' }}>
                レベル（{skill.level}/5）
              </label>
              <input type="range" min={1} max={5} value={skill.level}
                onChange={e => update(skill.id, 'level', Number(e.target.value))}
                className="w-full" style={{ accentColor: '#7c3aed' }} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#6b7280' }}>説明（任意）</label>
              <input value={skill.description}
                onChange={e => update(skill.id, 'description', e.target.value)}
                style={inputStyle} placeholder="簡単な説明..." />
            </div>

            <div className="flex justify-end">
              <button onClick={() => remove(skill.id)}
                className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-70"
                style={{ color: '#ef4444' }}>
                <Trash2 size={12} />削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}