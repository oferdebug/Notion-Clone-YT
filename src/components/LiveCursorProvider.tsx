"use client";

import { useMyPresence, useOthers } from "@liveblocks/react";
import React from "react";
import { FollowPointer } from "./FollowPointer";

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
  const [_myPresence, updateMyPresence] = useMyPresence();
  const _others = useOthers();

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    //Update My Presence From ClientX and ClientY for FullPage Cursor Tracking Event
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
    updateMyPresence({ cursor });
  }

  function handlePointerLeave() {
    updateMyPresence({ cursor: null });
  }

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {_others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence, info }) => (
          <FollowPointer
            key={connectionId}
            info={info}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
          />
        ))}
      {children}
    </div>
  );
}

export default LiveCursorProvider;


