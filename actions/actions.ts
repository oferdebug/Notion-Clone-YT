/** @format */

"use server";

import { adminDb } from "../firebase-admin";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function createNewDocument(): Promise<{ docId: string }> {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // Get user email
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!userEmail) {
    throw new Error("User email not found");
  }

  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Document",
    createdAt: new Date(),
    userId: userId,
  });

  // Add to users/{userId}/rooms/{roomId} - for user's document list
  await adminDb
    .collection("users")
    .doc(userId)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: userId,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  // Add to rooms/{roomId}/users/{userEmail} - for auth check
  await adminDb
    .collection("rooms")
    .doc(docRef.id)
    .collection("users")
    .doc(userEmail)
    .set({
      userId: userId,
      email: userEmail,
      role: "owner",
      createdAt: new Date(),
    });

  return { docId: docRef.id };
}
