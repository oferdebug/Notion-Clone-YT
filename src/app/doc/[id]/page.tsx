/** @format */

import RoomProvider from "@/components/RoomProvider";
import Document from "@/components/Document";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function DocumentPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <RoomProvider roomId={id}>
      <div className="flex flex-col flex-1 min-h-screen">
        <Document id={id} />
      </div>
    </RoomProvider>
  );
}

export default DocumentPage;
