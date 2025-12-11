"use server";
/** @format */

import {
  auth,
  currentUser,
} from '@clerk/nextjs/server';

import { adminDb } from '../firebase-admin';

// CREATE NEW DOCUMENT
export async function createNewDocument() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Unauthorized", docId: null };
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return { success: false, error: "User email not found", docId: null };
    }

    // Create new document
    const docRef = await adminDb.collection("documents").add({
      title: "Untitled Document",
      createdAt: new Date(),
      userId: userId,
    });

    // Add to user's rooms
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

    // Add owner to room
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

    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error("Error creating document:", error);
    return {
      success: false,
      error: "Failed to create document. Please try again.",
      docId: null,
    };
  }
}

// DELETE DOCUMENT
export async function deleteDocument(docId: string) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return { success: false, error: "User email not found" };
    }

    // Check if user is owner
    const roomUser = await adminDb
      .collection("rooms")
      .doc(docId)
      .collection("users")
      .doc(userEmail)
      .get();

    if (!roomUser.exists || roomUser.data()?.role !== "owner") {
      return { 
        success: false, 
        error: "Only document owners can delete documents" 
      };
    }

    // Delete document from documents collection
    await adminDb.collection("documents").doc(docId).delete();

    // Delete from user's room list
    await adminDb
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(docId)
      .delete();

    // Delete all users from room
    const users = await adminDb
      .collection("rooms")
      .doc(docId)
      .collection("users")
      .get();

    const deletePromises = users.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    // Delete the room itself
    await adminDb.collection("rooms").doc(docId).delete();

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { 
      success: false, 
      error: "Failed to delete document. Please try again." 
    };
  }
}

// SHARE DOCUMENT
export async function shareDocument(
  docId: string,
  email: string,
  role: "editor" | "viewer"
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return { success: false, error: "User email not found" };
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email address" };
    }

    // Check if user is trying to share with themselves
    if (email === userEmail) {
      return { success: false, error: "Cannot share document with yourself" };
    }

    // Check if current user is owner
    const roomUser = await adminDb
      .collection("rooms")
      .doc(docId)
      .collection("users")
      .doc(userEmail)
      .get();

    if (!roomUser.exists || roomUser.data()?.role !== "owner") {
      return {
        success: false,
        error: "Only document owners can share documents",
      };
    }

    // Check if user already has access
    const existingUser = await adminDb
      .collection("rooms")
      .doc(docId)
      .collection("users")
      .doc(email)
      .get();

    if (existingUser.exists) {
      // Update role if user already has access
      await adminDb
        .collection("rooms")
        .doc(docId)
        .collection("users")
        .doc(email)
        .update({
          role: role,
          updatedAt: new Date(),
        });

      return { 
        success: true, 
        message: "User access updated successfully" 
      };
    }

    // Add user to room
    await adminDb
      .collection("rooms")
      .doc(docId)
      .collection("users")
      .doc(email)
      .set({
        email: email,
        role: role,
        invitedBy: userId,
        invitedAt: new Date(),
      });

    return { 
      success: true, 
      message: "Document shared successfully" 
    };
  } catch (error) {
    console.error("Error sharing document:", error);
    return {
      success: false,
      error: "Failed to share document. Please try again.",
    };
  }
}

// REMOVE ACCESS
export async function removeAccess(docId: string, email: string) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return { success: false, error: "User email not found" };
    }

    // Check if current user is owner
    const roomUser = await adminDb
      .collection("rooms")
      .doc(docId)
      .collection("users")
      .doc(userEmail)
      .get();

    if (!roomUser.exists || roomUser.data()?.role !== "owner") {
      return {
        success: false,
        error: "Only document owners can remove access",
      };
    }

    // Cannot remove owner
    const targetUser = await adminDb
      .collection("rooms")
      .doc(docId)
      .collection("users")
      .doc(email)
      .get();

    if (targetUser.exists && targetUser.data()?.role === "owner") {
      return {
        success: false,
        error: "Cannot remove document owner",
      };
    }

    // Remove user from room
    await adminDb
      .collection("rooms")
      .doc(docId)
      .collection("users")
      .doc(email)
      .delete();

    return {
      success: true,
      message: "Access removed successfully",
    };
  } catch (error) {
    console.error("Error removing access:", error);
    return {
      success: false,
      error: "Failed to remove access. Please try again.",
    };
  }
}

// DUPLICATE DOCUMENT
export async function duplicateDocument(docId: string) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Unauthorized", docId: null };
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return { success: false, error: "User email not found", docId: null };
    }

    // Get original document
    const originalDoc = await adminDb.collection("documents").doc(docId).get();

    if (!originalDoc.exists) {
      return { success: false, error: "Document not found", docId: null };
    }

    const originalData = originalDoc.data();

    // Create new document
    const newDocRef = await adminDb.collection("documents").add({
      title: `${originalData?.title || "Untitled"} (Copy)`,
      createdAt: new Date(),
      userId: userId,
    });

    // Add to user's rooms
    await adminDb
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(newDocRef.id)
      .set({
        userId: userId,
        role: "owner",
        createdAt: new Date(),
        roomId: newDocRef.id,
      });

    // Add owner to room
    await adminDb
      .collection("rooms")
      .doc(newDocRef.id)
      .collection("users")
      .doc(userEmail)
      .set({
        userId: userId,
        email: userEmail,
        role: "owner",
        createdAt: new Date(),
      });

    return { success: true, docId: newDocRef.id };
  } catch (error) {
    console.error("Error duplicating document:", error);
    return {
      success: false,
      error: "Failed to duplicate document. Please try again.",
      docId: null,
    };
  }
}