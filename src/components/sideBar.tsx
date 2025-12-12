"use client";
/** @format */
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  collection,
  doc,
  DocumentData,
  getDoc,
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
  title?: string;
  content?: string;
  matchedContent?: string;
};

function SideBar() {
  const { user } = useUser();
  const userId = user?.id ?? null;
  const [searchQuery, setSearchQuery] = useState("");
  const [documentData, setDocumentData] = useState<
    Record<string, { title: string; content: string }>
  >({});
  const [isSearching, setIsSearching] = useState(false);

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
        const docData = documentData[curr.id];

        const typedRoom: RoomDocument = {
          id: curr.id,
          createdAt: roomData.createdAt,
          role: roomData.role,
          roomId: roomData.roomId,
          userId: roomData.userId,
          title: docData?.title,
          content: docData?.content,
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
  }, [data, documentData]);

  // Load document data (title + content) for search
  useEffect(() => {
    if (!data || !searchQuery.trim()) return;

    const loadDocumentData = async () => {
      setIsSearching(true);
      const docData: Record<string, { title: string; content: string }> = {};

      try {
        await Promise.all(
          data.docs.map(async (roomDoc) => {
            const docId = roomDoc.id;
            try {
              const docRef = doc(db, "documents", docId);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const data = docSnap.data();
                docData[docId] = {
                  title: data.title || "",
                  content: data.content || "",
                };
              }
            } catch (error) {
              console.error(`Error loading data for ${docId}:`, error);
            }
          })
        );

        setDocumentData(docData);
      } catch (error) {
        console.error("Error loading document data:", error);
      } finally {
        setIsSearching(false);
      }
    };

    loadDocumentData();
  }, [data, searchQuery]);

  // Extract context around matched text
  const getMatchContext = (
    text: string,
    query: string,
    contextLength: number = 50
  ): string => {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return "";

    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + query.length + contextLength);

    let context = text.substring(start, end);
    if (start > 0) context = "..." + context;
    if (end < text.length) context = context + "...";

    return context;
  };

  // Filter documents based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return groupedData;

    const query = searchQuery.toLowerCase();

    const filterFn = (doc: RoomDocument) => {
      // Search in roomId
      if (doc.roomId.toLowerCase().includes(query)) return true;

      // Search in document ID
      if (doc.id.toLowerCase().includes(query)) return true;

      // Search in document title
      if (doc.title && doc.title.toLowerCase().includes(query)) {
        return true;
      }

      // Search in document content
      if (doc.content && doc.content.toLowerCase().includes(query)) {
        doc.matchedContent = getMatchContext(doc.content, query);
        return true;
      }

      return false;
    };

    return {
      owner: groupedData.owner.filter(filterFn),
      editor: groupedData.editor.filter(filterFn),
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
          placeholder="Search in documents..."
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

      {/* Loading indicator for search */}
      {isSearching && searchQuery && (
        <div className="px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-xs">
              Searching content...
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-2">
        {filteredData.owner.length === 0 && filteredData.editor.length === 0 ? (
          <div className="px-3 py-6 text-center">
            {searchQuery ? (
              <>
                <Search
                  className="mx-auto mb-2 text-muted-foreground"
                  size={24}
                />
                <p className="text-muted-foreground text-sm">
                  No documents found
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Try a different search term
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-sm">
                  No documents yet
                </p>
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
                    <div key={doc.id}>
                      <SidebarOption id={doc.id} href={`/doc/${doc.roomId}`} />
                      {doc.matchedContent && (
                        <div className="px-3 py-1 ml-6 text-xs text-muted-foreground bg-muted/30 rounded">
                          {doc.matchedContent}
                        </div>
                      )}
                    </div>
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
                    <div key={doc.id}>
                      <SidebarOption id={doc.id} href={`/doc/${doc.roomId}`} />
                      {doc.matchedContent && (
                        <div className="px-3 py-1 ml-6 text-xs text-muted-foreground bg-muted/30 rounded">
                          {doc.matchedContent}
                        </div>
                      )}
                    </div>
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
