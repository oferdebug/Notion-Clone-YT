import { adminDb } from '../../../firebase-admin';
import liveblocks from '@/lib/liveblocks';
import  { auth }  from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { sessionClaims } = await auth(); // Ensure the user is authenticated

    const { room } = await req.json();

    const session = liveblocks.prepareSession(sessionClaims?.email || '', {
        userInfo: {
            name: sessionClaims?.fullName || '',
            email: sessionClaims?.email || '',
            avatar: sessionClaims?.imageUrl || '',
        },
    });

    const usersInRoom = await adminDb
        .collectionGroup('rooms')
        .where('userId', '==', sessionClaims?.email)
        .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
        session.allow(room, session.FULL_ACCESS);
        const { body, status } = await session.authorize();

        console.log(`✅ User ${sessionClaims?.email} authorized for room ${room}`);

        return new Response(body, { status });
    } else {
        return NextResponse.json(
            { message: `❌ User ${sessionClaims?.email} not authorized for room ${room}` },
            { status: 403 }
        );
    }
}