'use client';

import { type Editor } from '@tiptap/react';

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

interface EditorToolbarProps {
    editor: Editor;
}

function EditorToolbar({ editor }: EditorToolbarProps) {
    return (
        <div className='sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95'>
            <div className='max-w-5xl mx-auto px-6 py-3'>
                <div className='flex items-center gap-1'>
                    {/* Text Formatting */}
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('bold') 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold size={18} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('italic') 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic size={18} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('strike') 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Strikethrough"
                    >
                        <Strikethrough size={18} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('code') 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Code"
                    >
                        <Code size={18} strokeWidth={2.5} />
                    </button>

                    <div className="w-px h-6 bg-border mx-2" />

                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('heading', { level: 1 }) 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Heading 1"
                    >
                        <Heading1 size={18} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('heading', { level: 2 }) 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Heading 2"
                    >
                        <Heading2 size={18} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('heading', { level: 3 }) 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Heading 3"
                    >
                        <Heading3 size={18} strokeWidth={2.5} />
                    </button>

                    <div className="w-px h-6 bg-border mx-2" />

                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('bulletList') 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Bullet List"
                    >
                        <List size={18} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('orderedList') 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Numbered List"
                    >
                        <ListOrdered size={18} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2.5 rounded-lg transition-all duration-200 hover:bg-secondary ${
                            editor.isActive('blockquote') 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-foreground hover:text-foreground'
                        }`}
                        title="Quote"
                    >
                        <Quote size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditorToolbar;