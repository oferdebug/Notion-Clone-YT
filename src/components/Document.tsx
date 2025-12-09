"use client";
/** @format */

import useOwner from "@/lib/useOwner";
import { doc, updateDoc } from "firebase/firestore";
import { FormEvent, useState, useTransition } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Editor from "./Editor";
import { Save, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState<string | null>(null);
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  const currentTitle = input ?? data?.title ?? "";

  const updateTitle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentTitle.trim()) {
      startTransition(async () => {
        try {
          await updateDoc(doc(db, "documents", id), {
            title: currentTitle,
          });
          toast.success('Title updated!', {
            description: 'Your document title has been saved.',
            duration: 3000,
          });
          setInput(null); // Reset input after successful update
        } catch (error) {
          console.error('Failed to update title:', error);
          toast.error('Failed to update title', {
            description: 'Please try again.',
            duration: 4000,
          });
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={24} />
          <p className="text-muted-foreground font-medium">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-destructive font-semibold">
            Failed to load document: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground font-medium">Document not found.</p>
      </div>
    );
  }

  const ownershipRole = isOwner ? "owner" : "viewer";

  return (
    <section data-ownership-role={ownershipRole}>
      <div className="flex max-w-6xl mx-auto justify-between items-center pb-8 px-10 pt-10">
        <form className="flex flex-1 gap-3 items-center" onSubmit={updateTitle}>
          <div className="flex items-center gap-3 flex-1 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group">
            <FileText size={24} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <Input
              value={currentTitle}
              onChange={(e) => setInput(e.target.value)}
              className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent p-0 h-auto"
              placeholder="Untitled Document"
            />
          </div>

          <Button 
            disabled={isUpdating} 
            type="submit"
            className="bg-linear-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold px-6 py-6 rounded-xl group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center gap-2">
              {isUpdating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Update</span>
                </>
              )}
            </div>
          </Button>
        </form>
      </div>
      
      <div className="max-w-6xl mx-auto px-10">
        {/* ManageUsers */}
        {/* Avatars */}
      </div>
      
      <hr className="max-w-6xl mx-auto mb-10 border-border" />
      
      {/* Collaborative Editor */}
      <Editor />
    </section>
  );
}

export default Document;