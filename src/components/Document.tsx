/** @format */
"use client";

import useOwner from "@/lib/useOwner";
import { doc, updateDoc } from "firebase/firestore";
import { FormEvent, useState, useTransition } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Editor from "./Editor"; // Changed from CollabaretiveEditor

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
        await updateDoc(doc(db, "documents", id), {
          title: currentTitle,
        });
      });
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-500">Loading document…</p>;
  }

  if (error) {
    return (
      <p className="p-4 text-red-500">
        Failed to load document: {error.message}
      </p>
    );
  }

  if (!data) {
    return <p className="p-4 text-gray-500">Document not found.</p>;
  }

  const ownershipRole = isOwner ? "owner" : "viewer";

  return (
    <section data-ownership-role={ownershipRole}>
      <div className="flex max-w-6xl mx-auto justify-between pb-5 px-10 pt-10">
        <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
          <Input
            value={currentTitle}
            onChange={(e) => setInput(e.target.value)}
            className="text-2xl font-semibold border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
          />

          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </form>
      </div>
      <div>
        {/* ManageUsers */}
        {/* Avatars */}
      </div>
      <hr className="pb-10" />
      {/* Collaborative Editor */}
      <Editor /> {/* No documentId prop needed */}
    </section>
  );
}

export default Document;
