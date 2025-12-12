import {
  getApps,
  initializeApp,
} from 'firebase/app';
// lib/uploadImage.ts
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

// Initialize Firebase if needed
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export interface UploadProgress {
  progress: number;
  url?: string;
  error?: string;
}

/**
 * Upload an image to Firebase Storage
 * @param file - The image file to upload
 * @param onProgress - Callback for upload progress (0-100)
 * @returns Promise with the download URL
 */
export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image"));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      reject(new Error("Image must be less than 5MB"));
      return;
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = `images/${timestamp}-${randomString}-${file.name}`;

    // Create storage reference
    const storageRef = ref(storage, filename);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress callback
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(progress));
      },
      (error) => {
        // Error callback
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        // Success callback
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

/**
 * Upload image from clipboard paste event
 * @param clipboardData - The clipboard data from paste event
 * @param onProgress - Callback for upload progress
 * @returns Promise with the download URL or null if no image
 */
export async function uploadImageFromClipboard(
  clipboardData: DataTransfer,
  onProgress?: (progress: number) => void
): Promise<string | null> {
  const items = clipboardData.items;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith("image/")) {
      const file = items[i].getAsFile();
      if (file) {
        return uploadImage(file, onProgress);
      }
    }
  }

  return null;
}
