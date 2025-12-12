"use client";

import {
  useEffect,
  useState,
} from 'react';

import {
  Command,
  X,
} from 'lucide-react';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface Shortcut {
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  title: string;
  shortcuts: Shortcut[];
}

const shortcuts: ShortcutCategory[] = [
  {
    title: "General",
    shortcuts: [
      { keys: ["Ctrl", "K"], description: "Open keyboard shortcuts" },
      { keys: ["Ctrl", "N"], description: "Create new document" },
      { keys: ["Ctrl", "S"], description: "Save document" },
      { keys: ["Ctrl", "F"], description: "Search documents" },
      { keys: ["/"], description: "Open command menu" },
    ],
  },
  {
    title: "Text Editing",
    shortcuts: [
      { keys: ["Ctrl", "Z"], description: "Undo" },
      { keys: ["Ctrl", "Shift", "Z"], description: "Redo" },
      { keys: ["Ctrl", "B"], description: "Bold" },
      { keys: ["Ctrl", "I"], description: "Italic" },
      { keys: ["Ctrl", "U"], description: "Underline" },
      { keys: ["Ctrl", "Shift", "X"], description: "Strikethrough" },
      { keys: ["Ctrl", "E"], description: "Inline code" },
    ],
  },
  {
    title: "Formatting",
    shortcuts: [
      { keys: ["Ctrl", "Alt", "1"], description: "Heading 1" },
      { keys: ["Ctrl", "Alt", "2"], description: "Heading 2" },
      { keys: ["Ctrl", "Alt", "3"], description: "Heading 3" },
      { keys: ["Ctrl", "Shift", "7"], description: "Ordered list" },
      { keys: ["Ctrl", "Shift", "8"], description: "Bullet list" },
      { keys: ["Ctrl", "Shift", "9"], description: "Blockquote" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["Ctrl", "P"], description: "Quick document switcher" },
      { keys: ["Esc"], description: "Close dialog" },
      { keys: ["Tab"], description: "Navigate forward" },
      { keys: ["Shift", "Tab"], description: "Navigate backward" },
    ],
  },
];

const KeyboardShortcuts = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }

      // Escape to close
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2 text-muted-foreground hover:text-foreground"
        title="Keyboard shortcuts (Ctrl+K)"
      >
        <Command size={16} />
        <span className="hidden sm:inline">Shortcuts</span>
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Command className="text-primary" size={24} />
                Keyboard Shortcuts
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X size={16} />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {shortcuts.map((category) => (
              <div key={category.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm text-foreground">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <span key={keyIdx} className="flex items-center gap-1">
                            <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded shadow-sm min-w-[2rem] text-center">
                              {key}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground text-xs">
                                +
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Press <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">Ctrl+K</kbd> anytime to view shortcuts
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KeyboardShortcuts;
