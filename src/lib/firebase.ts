import { initializeApp, getApps } from 'firebase/app';
import { getAuth }        from 'firebase/auth';
import { getFirestore }   from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Basic check to see if config values are actually loaded and not placeholders
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY' || !firebaseConfig.projectId) {
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
  // Firestore collections ('users', 'balances', 'transactions', 'mobile', 'games')
  // do not need to be explicitly created. They are automatically created
  // when the first document is written to them.
} catch (error) {
  console.error("Error initializing Firebase services:", error);
  // In a real app, you might want to handle this more gracefully,
  // maybe show an error page or retry initialization.
  // For development, re-throwing helps identify the issue quickly.
  throw error;
}

export const auth = authInstance;
export const db = dbInstance;
