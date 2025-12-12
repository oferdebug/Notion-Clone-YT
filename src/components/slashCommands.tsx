"use client";

import 'tippy.js/dist/tippy.css';

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

import {
  Code,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';
import tippy, { Instance } from 'tippy.js';

import {
  Editor,
  Extension,
} from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';

export interface SlashCommand {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  command: ({
    editor,
    range,
  }: {
    editor: Editor;
    range: { from: number; to: number };
  }) => void;
}

interface SlashCommandsListProps {
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
}

interface SlashCommandsListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface SuggestionProps {
  editor: Editor;
  range: { from: number; to: number };
  query: string;
  text: string;
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
  clientRect?: (() => DOMRect | null) | null;
}

// UI Component for the suggestion popup
const SlashCommandsList = forwardRef<
  SlashCommandsListRef,
  SlashCommandsListProps
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (selectedIndex >= props.items.length && props.items.length > 0) {
    setSelectedIndex(0);
  }
  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((i) => (i + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((i) => (i + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }
      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }
      if (event.key === "Enter") {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) {
    return (
      <div className="min-w-[300px] bg-popover border border-border rounded-lg shadow-lg p-2">
        <div className="px-3 py-2 text-sm text-muted-foreground">
          No results found
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[320px] max-h-[400px] overflow-y-auto bg-popover border border-border rounded-lg shadow-xl p-2">
      <div className="space-y-1">
        {props.items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => selectItem(index)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                index === selectedIndex
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <div
                className={`mt-0.5 ${
                  index === selectedIndex
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-medium text-sm ${
                    index === selectedIndex
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {item.title}
                </div>
                <div
                  className={`text-xs mt-0.5 ${
                    index === selectedIndex
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

SlashCommandsList.displayName = "SlashCommandsList";

// Available slash commands
export const slashCommands: SlashCommand[] = [
  {
    title: "Text",
    description: "Just start writing with plain text",
    icon: FileText,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: Heading1,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: Heading2,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: Heading3,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list",
    icon: List,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: ListOrdered,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote",
    icon: Quote,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Insert a code snippet",
    icon: Code,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "Image",
    description: "Upload or embed an image",
    icon: ImageIcon,
    command: ({ editor, range }) => {
      // Delete the slash command text
      editor.chain().focus().deleteRange(range).run();

      // Trigger image upload UI
      const url = window.prompt("Enter image URL:");
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
];

// Suggestion renderer for @tiptap/suggestion
export const getSuggestion = () => ({
  items: ({ query }: { query: string }) => {
    const searchText = query.toLowerCase();
    return slashCommands.filter(
      (item) =>
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
    );
  },

  render: () => {
    let component: ReactRenderer<
      SlashCommandsListRef,
      SlashCommandsListProps
    > | null = null;
    let popup: Instance | null = null;

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(SlashCommandsList, {
          editor: props.editor,
          props,
        });

        if (!props.clientRect) return;

        popup = tippy(document.body, {
          getReferenceClientRect: () => props.clientRect?.() ?? new DOMRect(),
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: SuggestionProps) {
        component?.updateProps(props);
        if (!props.clientRect) return;
        popup?.setProps({
          getReferenceClientRect: () => props.clientRect?.() ?? new DOMRect(),
        });
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === "Escape") {
          popup?.hide();
          return true;
        }
        return component?.ref?.onKeyDown?.(props) ?? false;
      },

      onExit() {
        popup?.destroy();
        component?.destroy();
      },
    };
  },
});

// Tiptap Extension
const SlashCommands = Extension.create({
  name: "slashCommands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: { from: number; to: number };
          props: SlashCommand;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default SlashCommands;
