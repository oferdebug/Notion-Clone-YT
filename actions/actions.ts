/** @format */

'use server';

import { adminDb } from '../firebase-admin';
import { auth } from '@clerk/nextjs/server';

export async function createNewDocument(): Promise<{ docId: string }> {
	const { userId } = await auth();

	if (!userId) {
		throw new Error('Unauthorized');
	}

	const docCollectionRef = adminDb.collection('documents');
	const docRef = await docCollectionRef.add({
		title: 'New Document',
	});

	await adminDb
		.collection('users')
		.doc(userId)
		.collection('rooms')
		.doc(docRef.id)
		.set({
			userId: userId,
			role: 'Owner',
			createdAt: new Date(),
			roomId: docRef.id,
		});

	return { docId: docRef.id };
}
