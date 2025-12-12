"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { SlashCommand } from './slashCommands';

interface SlashCommandsListProps {
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
}

interface SlashCommandsListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const SlashCommandsList = forwardRef<SlashCommandsListRef, SlashCommandsListProps>(
  (props, ref) => {
    const itemsKey = useMemo(() => props.items.map(i => i.title).join(','), [props.items]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [lastItemsKey, setLastItemsKey] = useState(itemsKey);

    // Reset selectedIndex when items change
    if (itemsKey !== lastItemsKey) {
      setSelectedIndex(0);
      setLastItemsKey(itemsKey);
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
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
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
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div
                  className={`mt-0.5 ${
                    index === selectedIndex
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm ${
                      index === selectedIndex
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {item.title}
                  </div>
                  <div
                    className={`text-xs mt-0.5 ${
                      index === selectedIndex
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
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
  }
);

SlashCommandsList.displayName = 'SlashCommandsList';

export default SlashCommandsList;