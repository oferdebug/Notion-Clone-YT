import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
async function DocLayout({
  children,
  _params,
}: {
  children: React.ReactNode;
  _params: Promise<{ id: string }>;
}) {
  await auth.protect();
  const { id } = await _params;

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocLayout;
