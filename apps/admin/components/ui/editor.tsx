'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'

interface EditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 mb-2 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-wrap gap-1 mb-1 w-full">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('underline') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <select
          onChange={(e) => {
            if (e.target.value === 'paragraph') {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) }).run()
            }
          }}
          className="px-2 py-1 rounded text-sm bg-white border border-gray-300"
          value={
            editor.isActive('heading', { level: 1 })
              ? '1'
              : editor.isActive('heading', { level: 2 })
              ? '2'
              : editor.isActive('heading', { level: 3 })
              ? '3'
              : 'paragraph'
          }
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
        <select
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="px-2 py-1 rounded text-sm bg-white border border-gray-300"
          value={editor.getAttributes('textStyle').color || '#000000'}
        >
          <option value="#000000">Default</option>
          <option value="#FF0000">Red</option>
          <option value="#0000FF">Blue</option>
          <option value="#008000">Green</option>
          <option value="#FFA500">Orange</option>
          <option value="#800080">Purple</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-1 w-full">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
          title="Ordered List"
        >
          1. List
        </button>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
            title="Align Left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
            title="Align Center"
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
            title="Align Right"
          >
            →
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('URL')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('link') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
          title="Add Link"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="px-2 py-1 rounded text-sm bg-white border border-gray-300"
          disabled={!editor.isActive('link')}
          title="Remove Link"
        >
          Unlink
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Image URL')
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
          className="px-2 py-1 rounded text-sm bg-white border border-gray-300"
          title="Add Image"
        >
          Image
        </button>
      </div>
    </div>
  )
}

const Editor = ({ 
  value, 
  onChange, 
  placeholder = 'Enter job description...', 
  className = '',
  minHeight = '300px'
}: EditorProps) => {
  const [mounted, setMounted] = useState(false)
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        validate: href => /^https?:\/\//.test(href),
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Image,
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Handle SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML() && value !== '') {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  if (!mounted) {
    return <div className={`w-full bg-gray-100 rounded-md`} style={{ minHeight }}></div>
  }

  return (
    <div className={`border border-gray-200 rounded-md ${className}`}>
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4" 
        style={{ minHeight }}
      />
    </div>
  )
}

export default Editor