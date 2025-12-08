/** @format */

import { LiveList, LiveObject } from "@liveblocks/client";

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      cursor: { x: number; y: number } | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      people: LiveObject<Record<string, any>>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: LiveList<any>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        email: string;
        avatar: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    RoomEvent: {};

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      x: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      storage: Record<string, never>;
    };
  }
}

export {};