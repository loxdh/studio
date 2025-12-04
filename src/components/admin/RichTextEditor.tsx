
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, Pilcrow, List, ListOrdered, Image as ImageIcon } from 'lucide-react';

const MenuBar = ({ editor }: { editor: any }) => {
  const storage = useStorage();

  const addImage = useCallback(() => {
    if (!editor || !storage) return;
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files) {
        const file = input.files[0];

        try {
          if (!storage) throw new Error("Storage not initialized");
          const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
          const uploadResult = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(uploadResult.ref);
          editor.chain().focus().setImage({ src: downloadURL }).run();
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
  }, [editor, storage]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border border-input rounded-t-md bg-transparent">
      <Button variant={editor.isActive('bold') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('italic') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('strike') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('code') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleCode().run()}><Code className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('paragraph') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().setParagraph().run()}><Pilcrow className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('bulletList') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Button>
      <Button variant={editor.isActive('orderedList') ? 'default' : 'ghost'} size="icon" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Button>
      <Button variant='ghost' size="icon" onClick={addImage}><ImageIcon className="h-4 w-4" /></Button>
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[200px]',
      },
    },
    immediatelyRender: false,
  }, [value]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // This is the key fix: We are re-initializing the editor's content once it has mounted on the client.
  useEffect(() => {
    if (isMounted && editor && !editor.isDestroyed) {
      editor.commands.setContent(value);
    }
  }, [isMounted, value, editor]);

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="border border-input rounded-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
