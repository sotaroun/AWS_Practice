'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { supabase } from '@/lib/supabase'
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, ImageIcon, Code } from 'lucide-react'

type Props = {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichEditor({ content, onChange, placeholder = '内容を入力...' }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    immediatelyRender: false, // ← これを追加
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('portfolio-images')
      .upload(path, file)
    if (error) { alert('画像アップロード失敗'); return }
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
    editor.chain().focus().setImage({ src: data.publicUrl }).run()
  }

  const btn = (active: boolean) =>
    `p-1.5 rounded transition-colors ${active
      ? 'bg-violet-600 text-white'
      : 'text-slate-400 hover:text-white hover:bg-slate-700'}`

  return (
    <div style={{ border: '2px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
      {/* ツールバー */}
      <div className="flex items-center gap-1 px-2 py-1.5 flex-wrap"
        style={{ background: '#f8f7ff', borderBottom: '1px solid #e5e7eb' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className="p-1.5 rounded-lg transition-colors"
          style={editor.isActive('bold')
            ? { background: '#7c3aed', color: 'white' }
            : { color: '#6b7280' }}>
          <Bold size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-1.5 rounded-lg transition-colors"
          style={editor.isActive('italic')
            ? { background: '#7c3aed', color: 'white' }
            : { color: '#6b7280' }}>
          <Italic size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()}
          className="p-1.5 rounded-lg transition-colors"
          style={editor.isActive('code')
            ? { background: '#7c3aed', color: 'white' }
            : { color: '#6b7280' }}>
          <Code size={14} /></button>
        <div className="w-px h-4 mx-1" style={{ background: '#e5e7eb' }} />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="p-1.5 rounded-lg transition-colors"
          style={editor.isActive('heading', { level: 2 })
            ? { background: '#7c3aed', color: 'white' }
            : { color: '#6b7280' }}>
          <Heading2 size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="p-1.5 rounded-lg transition-colors"
          style={editor.isActive('heading', { level: 3 })
            ? { background: '#7c3aed', color: 'white' }
            : { color: '#6b7280' }}>
          <Heading3 size={14} /></button>
        <div className="w-px h-4 mx-1" style={{ background: '#e5e7eb' }} />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="p-1.5 rounded-lg transition-colors"
          style={editor.isActive('bulletList')
            ? { background: '#7c3aed', color: 'white' }
            : { color: '#6b7280' }}>
          <List size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="p-1.5 rounded-lg transition-colors"
          style={editor.isActive('orderedList')
            ? { background: '#7c3aed', color: 'white' }
            : { color: '#6b7280' }}>
          <ListOrdered size={14} /></button>
        <div className="w-px h-4 mx-1" style={{ background: '#e5e7eb' }} />
        <label className="p-1.5 rounded-lg cursor-pointer transition-colors"
          style={{ color: '#6b7280' }}>
          <ImageIcon size={14} />
          <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
        </label>
      </div>
      {/* エディタ本体 */}
      <div style={{ background: 'white', minHeight: '120px' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}