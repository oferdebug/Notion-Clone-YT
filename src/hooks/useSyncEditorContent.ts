// hooks/useSyncEditorContent.ts
import {
  useEffect,
  useRef,
} from 'react';

import {
  doc,
  updateDoc,
} from 'firebase/firestore';

import { Editor } from '@tiptap/react';

import { db } from '../../firebase';

/**
 * Syncs Tiptap editor content to Firestore for search functionality
 * Debounces updates to avoid excessive writes
 */
export function useSyncEditorContent(
  editor: Editor | null,
  documentId: string
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastContentRef = useRef<string>("");

  useEffect(() => {
    if (!editor || !documentId) return;

    const syncContent = async () => {
      try {
        const currentContent = editor.getText();

        // Only update if content actually changed
        if (currentContent === lastContentRef.current) return;

        lastContentRef.current = currentContent;

        const docRef = doc(db, "documents", documentId);
        await updateDoc(docRef, {
          content: currentContent,
          contentLength: currentContent.length,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("Error syncing content to Firestore:", error);
      }
    };

    // Listen to editor updates
    const handleUpdate = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce: wait 2 seconds after last change
      timeoutRef.current = setTimeout(() => {
        syncContent();
      }, 2000);
    };

    editor.on("update", handleUpdate);

    // Cleanup
    return () => {
      editor.off("update", handleUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [editor, documentId]);
}
