import { initializeApp, getApps } from 'firebase/app'; // Ensure getApps is imported
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Ensure environment variables are loaded correctly.
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Basic check (optional but good practice)
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn( // Use warn instead of error to avoid breaking HMR sometimes
    'Firebase configuration values (apiKey or projectId) seem missing or invalid. ' +
    'Please ensure your .env.local file is correctly set up with valid Firebase project credentials ' +
    'and restart the development server (npm run dev).'
  );
}

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully.");
  } catch (e) {
    console.error("Firebase initialization error:", e);
    // Handle initialization error appropriately
    // Maybe set app to null or re-throw depending on desired behavior
  }
} else {
  app = getApps()[0];
  console.log("Firebase already initialized.");
}


let authInstance: ReturnType<typeof getAuth>;
let dbInstance: ReturnType<typeof getFirestore>;

try {
  // Check if app was initialized successfully before getting services
  if (app) {
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  } else {
    // Handle the case where app initialization failed
    console.error("Cannot get Firebase services because app initialization failed.");
    // Assign dummy or throw error, depending on how you want to handle this
    // For now, assigning as any to satisfy TypeScript, but this needs proper handling
    authInstance = null as any;
    dbInstance = null as any;
  }
} catch (error) {
  console.error("Error initializing Firebase services (getAuth/getFirestore):", error);
  // Assign dummy or throw error
  authInstance = null as any;
  dbInstance = null as any;
}

export const auth = authInstance;
export const db = dbInstance;