"use client";
// components/Editor.tsx

import {
  useEffect,
  useState,
} from 'react';

import * as Y from 'yjs';

import { useSyncEditorContent } from '@/hooks/useSyncEditorContent';
import {
  uploadImage,
  uploadImageFromClipboard,
} from '@/lib/uploadImage';
import {
  useRoom,
  useSelf,
} from '@liveblocks/react/suspense';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import {
  EditorContent,
  useEditor,
} from '@tiptap/react';

import EditorToolbar from './EditorToolbar';
import LoadingSpinner from './LoadingSpinner';
import SlashCommands, { getSuggestion } from './slashCommands';

interface EditorProps {
  documentId: string;
}

export default function Editor({ documentId }: EditorProps) {
  const room = useRoom() as never;
  const userInfo = useSelf((me) => me.info);
  const [provider, setProvider] = useState<{
    yDoc: Y.Doc;
    provider: LiveblocksYjsProvider;
  } | null>(null);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yjsProvider = new LiveblocksYjsProvider(room, yDoc);

    const timer = setTimeout(() => {
      setProvider({ yDoc, provider: yjsProvider });
    }, 0);

    return () => {
      clearTimeout(timer);
      yDoc?.destroy();
      yjsProvider?.destroy();
    };
  }, [room]);

  const editor = useEditor(
    {
      extensions: provider
        ? [
            Document,
            Paragraph,
            Text,
            Bold.configure(),
            Italic.configure(),
            Strike.configure(),
            Code.configure(),
            Heading.configure({
              levels: [1, 2, 3],
            }),
            BulletList.configure(),
            OrderedList.configure(),
            ListItem,
            Blockquote.configure(),
            CodeBlock.configure(),
            HardBreak,
            Image.configure({
              inline: true,
              allowBase64: true,
              HTMLAttributes: {
                class: "rounded-lg max-w-full h-auto my-4",
              },
            }),
            Collaboration.configure({
              document: provider.yDoc,
            }),
            CollaborationCursor.configure({
              provider: provider.provider,
              user: {
                name: userInfo?.name || "Anonymous",
                color: "#6366f1",
              },
            }),
            Placeholder.configure({
              placeholder: "Type '/' for commands...",
            }),
            SlashCommands.configure({
              suggestion: getSuggestion(),
            }),
          ]
        : [
            Document,
            Paragraph,
            Text,
            Placeholder.configure({
              placeholder: "Loading...",
            }),
          ],
      editorProps: {
        attributes: {
          class: "focus:outline-none",
        },
        handlePaste: (view, event, _slice) => {
          // Handle image paste from clipboard
          if (event.clipboardData) {
            uploadImageFromClipboard(event.clipboardData)
              .then((url) => {
                if (url && editor) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              })
              .catch((error) => {
                console.error("Clipboard paste error:", error);
              });
            event.preventDefault();
            return true;
          }
          return false;
        },
        handleDrop: (view, event, slice, moved) => {
          // Handle image drag & drop
          if (!moved && event.dataTransfer?.files?.length) {
            const file = event.dataTransfer.files[0];

            if (file.type.startsWith("image/")) {
              event.preventDefault();

              uploadImage(file)
                .then((url) => {
                  const { from } = view.state.selection;
                  editor
                    ?.chain()
                    .focus()
                    .insertContentAt(from, {
                      type: "image",
                      attrs: { src: url },
                    })
                    .run();
                })
                .catch((error) => {
                  console.error("Drop upload error:", error);
                });

              return true;
            }
          }
          return false;
        },
      },
    },
    [provider?.yDoc, provider?.provider, userInfo]
  );

  // Sync editor content to Firestore for search functionality
  useSyncEditorContent(editor, documentId);

  if (!editor || !provider) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner color="brand" centered />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EditorToolbar editor={editor} />

      <div className="max-w-5xl mx-auto pt-8 pb-40 px-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
