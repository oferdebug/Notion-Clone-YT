import {
  NextRequest,
  NextResponse,
} from 'next/server';

import liveblocks from '@/lib/liveblocks';
import {
  auth,
  currentUser,
} from '@clerk/nextjs/server';

import { adminDb } from '../../../firebase-admin';

export async function POST(req: NextRequest) {
  // Auth check: Get authenticated user from Clerk
  const { userId } = await auth(); // <-await!
  const user = await currentUser();

  // Prevent Liveblocks 500 error: Ensure both Clerk ID and email exist
  if (!userId || !user?.emailAddresses?.[0]?.emailAddress) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { room } = await req.json();

  // Use user's email as the Liveblocks userId
  const liveblocksUserId = user.emailAddresses[0].emailAddress;
  const userName = user.fullName || user.firstName || liveblocksUserId;
  const userAvatar = user.imageUrl || "";

  // Setup Liveblocks session with user metadata
  const session = liveblocks.prepareSession(liveblocksUserId, {
    userInfo: {
      name: userName,
      email: liveblocksUserId,
      avatar: userAvatar,
    },
  });

  // Permission check against Firestore
  try {
    const userRoomRef = adminDb
      .collection("rooms")
      .doc(room)
      .collection("users")
      .doc(liveblocksUserId);

    const userInRoom = await userRoomRef.get();

    if (userInRoom.exists) {
      // User is authorized for this room
      session.allow(room, session.FULL_ACCESS);
      const { body, status } = await session.authorize();

      console.log(`✅ User ${liveblocksUserId} authorized for room ${room}`);

      return new Response(body, { status });
    } else {
      // User lacks permissions
      console.log(
        `❌ User ${liveblocksUserId} not authorized for room ${room}`
      );
      return NextResponse.json(
        {
          message: `You don't have access to this document.`,
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("CRITICAL AUTH ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error during authorization." },
      { status: 500 }
    );
  }
}
