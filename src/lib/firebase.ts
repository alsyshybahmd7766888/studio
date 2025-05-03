import { initializeApp, getApps } from 'firebase/app'; // Ensure getApps is imported
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Ensure environment variables are loaded correctly.
// Check your .env.local file and make sure it's in the project root.
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Basic check to see if config values are actually loaded and not placeholders
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    'Firebase configuration values (apiKey or projectId) seem missing or invalid. ' +
    'Please ensure your .env.local file is correctly set up with valid Firebase project credentials ' +
    'and restart the development server (npm run dev).'
  );
}

// Initialize Firebase only if it hasn't been initialized yet
// Use getApps() to prevent re-initialization in HMR scenarios
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let authInstance: ReturnType<typeof getAuth>;
let dbInstance: ReturnType<typeof getFirestore>;

try {
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase services:", error);
  // Avoid throwing error in dev to prevent app crash, rely on console error
  // throw error;
}

// Export the instances, handling potential initialization errors gracefully
export const auth = authInstance!;
export const db = dbInstance!;
