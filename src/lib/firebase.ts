// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Ensure environment variables are loaded correctly.
// Check your .env.local file and make sure it's in the project root.
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // Ensure this matches the key in Firebase Console
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Basic check to see if config values are actually loaded and not placeholders
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY' || firebaseConfig.apiKey.startsWith('AIzaSyDU6drUk09IvFY2jX30KBeFuSDV3O1L2k4')) { // Added check for the specific placeholder key provided earlier
  console.error(
    'Firebase configuration values are missing, invalid, or placeholders. ' +
    'Please ensure your .env.local file is correctly set up with valid Firebase project credentials ' +
    'and restart the development server (npm run dev).'
  );
  // Optionally throw an error in production to prevent deployment with bad config
  // if (process.env.NODE_ENV === 'production') {
  //   throw new Error("Firebase configuration is missing or invalid.");
  // }
}

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let authInstance: ReturnType<typeof getAuth>;
let dbInstance: ReturnType<typeof getFirestore>;

try {
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase services:", error);
  // Handle initialization error, maybe show a message to the user or log more details
  // Depending on the error, you might want to throw it to stop the app load
  throw error; // Re-throw the error to make it visible during development
}

export const auth = authInstance;
export const db = dbInstance;
