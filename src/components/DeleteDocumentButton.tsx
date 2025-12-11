"use client";
/** @format */

import { useState } from 'react';

import {
  AlertTriangle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { deleteDocument } from '../../actions/actions';

interface DeleteDocumentButtonProps {
  docId: string;
  className?: string;
}

export default function DeleteDocumentButton({ 
  docId, 
  className 
}: DeleteDocumentButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteDocument(docId);

      if (result.success) {
        toast.success("Document deleted", {
          description: "Your document has been permanently deleted.",
        });
        router.push("/");
      } else {
        toast.error("Failed to delete", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong", {
        description: "Unable to delete document.",
      });
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {/* Delete Button */}
      <Button
        onClick={() => setShowConfirm(true)}
        variant="ghost"
        size="sm"
        className={className}
        disabled={isDeleting}
      >
        <Trash2 size={16} className="mr-2" />
        Delete
      </Button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowConfirm(false)}
        >
          <div 
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
              <AlertTriangle className="text-destructive" size={24} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Delete Document?
            </h3>

            {/* Description */}
            <p className="text-muted-foreground mb-6">
              This action cannot be undone. This will permanently delete the document
              and remove all associated data.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirm(false)}
                variant="outline"
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}