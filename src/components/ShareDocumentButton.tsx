"use client";
/** @format */

import { useState } from 'react';

import {
  Check,
  Loader2,
  Mail,
  Share2,
  UserPlus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { shareDocument } from '../../actions/actions';

interface ShareDocumentButtonProps {
  docId: string;
  className?: string;
}

export default function ShareDocumentButton({
  docId,
  className,
}: ShareDocumentButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email required", {
        description: "Please enter an email address",
      });
      return;
    }

    setIsSharing(true);

    try {
      const result = await shareDocument(docId, email, role);

      if (result.success) {
        toast.success("Document shared!", {
          description: result.message || `Shared with ${email}`,
        });
        setEmail("");
        setRole("editor");
      } else {
        toast.error("Failed to share", {
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Something went wrong", {
        description: "Unable to share document",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      {/* Share Button */}
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        size="sm"
        className={className}
      >
        <Share2 size={16} className="mr-2" />
        Share
      </Button>

      {/* Share Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Share2 className="text-primary" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Share Document
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Add People Form */}
              <form onSubmit={handleShare} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="pl-10"
                      disabled={isSharing}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Permission
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("editor")}
                      className={`p-3 rounded-lg border transition-all ${
                        role === "editor"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      disabled={isSharing}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-medium text-sm">Editor</div>
                          <div className="text-xs text-muted-foreground">
                            Can edit
                          </div>
                        </div>
                        {role === "editor" && (
                          <Check size={16} className="text-primary" />
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("viewer")}
                      className={`p-3 rounded-lg border transition-all ${
                        role === "viewer"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      disabled={isSharing}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-medium text-sm">Viewer</div>
                          <div className="text-xs text-muted-foreground">
                            Can view
                          </div>
                        </div>
                        {role === "viewer" && (
                          <Check size={16} className="text-primary" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Share Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSharing || !email}
                >
                  {isSharing ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      Share Document
                    </>
                  )}
                </Button>
              </form>

              {/* Info */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> The person you invite will receive
                  access immediately. They can start collaborating right away!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

