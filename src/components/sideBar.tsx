"use client";
/** @format */
import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, DocumentData } from "firebase/firestore";
import NewDocumentButton from "./NewDocumentButton";
import SidebarOption from "./SidebarOption";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { db } from "../../firebase";

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

  const menuOptions = (
    <div className="flex flex-col gap-3">
      <NewDocumentButton />

      <div className="flex flex-col gap-2 mt-2">
        {groupedData.owner.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-muted-foreground text-sm">No documents yet</p>
            <p className="text-muted-foreground text-xs mt-1">Create your first document</p>
          </div>
        ) : (
          <>
            <h2 className="text-muted-foreground font-semibold text-xs uppercase tracking-wider px-2 mb-1">
              My Documents
            </h2>
            <div className="flex flex-col gap-1">
              {groupedData.owner.map((doc) => (
                <SidebarOption
                  key={doc.id}
                  id={doc.id}
                  href={`/doc/${doc.roomId}`}
                />
              ))}
            </div>
          </>
        )}

        {groupedData.editor.length > 0 && (
          <>
            <h2 className="text-muted-foreground font-semibold text-xs uppercase tracking-wider px-2 mt-4 mb-1">
              Shared With Me
            </h2>
            <div className="flex flex-col gap-1">
              {groupedData.editor.map((doc) => (
                <SidebarOption
                  key={doc.id}
                  id={doc.id}
                  href={`/doc/${doc.roomId}`}
                />
              ))}
            </div>
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