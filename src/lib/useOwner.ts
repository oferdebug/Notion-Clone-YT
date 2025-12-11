'use client';
import { useMemo } from 'react';

import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

import { useUser } from '@clerk/nextjs';
import { useRoom } from '@liveblocks/react/suspense';

import { db } from '../../firebase';

function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  
  const [data] = useCollection(
    user && collection(db, "users", user.id, "rooms")
  );

  const isOwner = useMemo(() => {
    if (!data || !room) return false;
    
    const roomDoc = data.docs.find((doc) => doc.data().roomId === room.id);
    return roomDoc?.data().role === "owner";
  }, [data, room]);

  return isOwner;
}

export default useOwner;