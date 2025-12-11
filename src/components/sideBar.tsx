"use client";
/** @format */
import {
  useMemo,
  useState,
} from 'react';

import {
  collection,
  DocumentData,
  query,
} from 'firebase/firestore';
import {
  MenuIcon,
  Search,
  X,
} from 'lucide-react';
import { useCollection } from 'react-firebase-hooks/firestore';

import { useUser } from '@clerk/nextjs';

import { db } from '../../firebase';
import NewDocumentButton from './NewDocumentButton';
import SidebarOption from './SidebarOption';
import { Input } from './ui/input';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

type RoomDocument = {
  id: string;
  createdAt: unknown;
  role: string;
  roomId: string;
  userId: string;
};

function SideBar() {
  const { user } = useUser();
  const userId = user?.id ?? null;
  const [searchQuery, setSearchQuery] = useState("");

  const roomsRef = userId ? collection(db, "users", userId, "rooms") : null;
  const [data] = useCollection(roomsRef ? query(roomsRef) : null);

  const groupedData = useMemo(() => {
    if (!data) return { owner: [], editor: [] } as const;

    return data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as DocumentData;
        const typedRoom: RoomDocument = {
          id: curr.id,
          createdAt: roomData.createdAt,
          role: roomData.role,
          roomId: roomData.roomId,
          userId: roomData.userId,
        };

        if (typedRoom.role === "Owner") {
          acc.owner.push(typedRoom);
        } else {
          acc.editor.push(typedRoom);
        }

        return acc;
      },
      {
        owner: [],
        editor: [],
      }
    );
  }, [data]);

  // Filter documents based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return groupedData;

    const query = searchQuery.toLowerCase();
    return {
      owner: groupedData.owner.filter(doc => 
        doc.roomId.toLowerCase().includes(query) || 
        doc.id.toLowerCase().includes(query)
      ),
      editor: groupedData.editor.filter(doc => 
        doc.roomId.toLowerCase().includes(query) || 
        doc.id.toLowerCase().includes(query)
      ),
    };
  }, [groupedData, searchQuery]);

  const menuOptions = (
    <div className="flex flex-col gap-3">
      <NewDocumentButton />

      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className="pl-10 pr-10 bg-muted/50 border-border focus:bg-background transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {filteredData.owner.length === 0 && filteredData.editor.length === 0 ? (
          <div className="px-3 py-6 text-center">
            {searchQuery ? (
              <>
                <Search className="mx-auto mb-2 text-muted-foreground" size={24} />
                <p className="text-muted-foreground text-sm">No documents found</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Try a different search term
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-sm">No documents yet</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Create your first document
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {filteredData.owner.length > 0 && (
              <>
                <h2 className="text-muted-foreground font-semibold text-xs uppercase tracking-wider px-2 mb-1">
                  My Documents ({filteredData.owner.length})
                </h2>
                <div className="flex flex-col gap-1">
                  {filteredData.owner.map((doc) => (
                    <SidebarOption
                      key={doc.id}
                      id={doc.id}
                      href={`/doc/${doc.roomId}`}
                    />
                  ))}
                </div>
              </>
            )}

            {filteredData.editor.length > 0 && (
              <>
                <h2 className="text-muted-foreground font-semibold text-xs uppercase tracking-wider px-2 mt-4 mb-1">
                  Shared With Me ({filteredData.editor.length})
                </h2>
                <div className="flex flex-col gap-1">
                  {filteredData.editor.map((doc) => (
                    <SidebarOption
                      key={doc.id}
                      id={doc.id}
                      href={`/doc/${doc.roomId}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-sidebar border-r border-sidebar-border relative min-h-screen">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="p-2 rounded-lg hover:bg-secondary transition-colors border border-border">
            <MenuIcon className="text-foreground" size={24} />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="h-full w-80 fixed z-50 overflow-y-auto rounded-none bg-sidebar border-sidebar-border"
          >
            <SheetHeader>
              <SheetTitle className="text-foreground">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4">{menuOptions}</div>
            <SheetFooter />
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
}

export default SideBar;