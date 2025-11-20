/** @format */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCX2Dle_SPvU1b4HPzb-34J62PpMicfu1c',
	authDomain: 'notion-clone-f7651.firebaseapp.com',
	databaseURL: 'https://notion-clone-f7651-default-rtdb.firebaseio.com',
	projectId: 'notion-clone-f7651',
	storageBucket: 'notion-clone-f7651.firebasestorage.app',
	messagingSenderId: '179663101977',
	appId: '1:179663101977:web:5431e3e46c4ed22734ca88',
	measurementId: 'G-44B26THVDH',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
