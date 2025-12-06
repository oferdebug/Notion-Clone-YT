// components/Editor.tsx
"use client";

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
import { useMemo, useEffect } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import LoadingSpinner from "./LoadingSpinner";

export default function Editor() {
  const room = useRoom() as never;
  const userInfo = useSelf((me) => me.info);

  const yjsProvider = useMemo(() => {
    const yDoc = new Y.Doc();
    const provider = new LiveblocksYjsProvider(room, yDoc);
    return { yDoc, provider };
  }, [room]);

  useEffect(() => {
    return () => {
      yjsProvider.yDoc?.destroy();
      yjsProvider.provider?.destroy();
    };
  }, [yjsProvider]);

  const editor = useEditor(
    {
      extensions: [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        Strike,
        Code,
        Heading,
        BulletList,
        OrderedList,
        ListItem,
        Blockquote,
        CodeBlock,
        HardBreak,
        Collaboration.configure({
          document: yjsProvider.yDoc,
        }),
        CollaborationCursor.configure({
          provider: yjsProvider.provider,
          user: {
            name: userInfo?.name || "Anonymous",
            color: "#3b82f6",
          },
        }),
        Placeholder.configure({
          placeholder: "Type '/' for commands...",
        }),
      ],
      editorProps: {
        attributes: {
          class: "focus:outline-none",
        },
      },
    },
    [yjsProvider.yDoc, yjsProvider.provider, userInfo]
  );

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-20 pb-40 px-12">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
