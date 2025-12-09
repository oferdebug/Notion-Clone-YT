"use client";
// components/Editor.tsx

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import HardBreak from "@tiptap/extension-hard-break";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useState, useEffect } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import LoadingSpinner from "./LoadingSpinner";
import EditorToolbar from "./EditorToolbar";

export default function Editor() {
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
      },
    },
    [provider?.yDoc, provider?.provider, userInfo]
  );

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