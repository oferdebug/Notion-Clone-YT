/** @format */
"use client";

import {
  ClientSideSuspense,
  RoomProvider as RoomProviderWrapper,
} from "@liveblocks/react/suspense";
import LiveCursorProvider from "./LiveCursorProvider";
import LoadingSpinner from "./LoadingSpinner";
import { LiveObject, LiveList } from "@liveblocks/client";

function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  return (
    <RoomProviderWrapper
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
      initialStorage={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        people: new LiveObject<Record<string, any>>({}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages: new LiveList<any>([]),
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner color="brand" centered />}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
}

export default RoomProvider;


