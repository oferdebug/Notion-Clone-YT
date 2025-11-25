/** @format */

import { adminDb } from './firebase-admin';

async function main() {
	const docRef = await adminDb.collection('test_admin_connection').add({
		createdAt: new Date(),
		from: 'test-firebase-admin.ts',
	});

	console.log('✅ Firestore admin test OK, doc id:', docRef.id);
}

main().catch((err) => {
	console.error('❌ Firestore admin test FAILED');
	console.error(err);
	process.exit(1);
});
