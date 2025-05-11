// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app"; // Ensure getApps is imported
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics"; // Import getAnalytics

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU6drUk09IvFY2jX30KBeFuSDV3O1L2k4",
  authDomain: "easy-recharge-cx0ki.firebaseapp.com",
  projectId: "easy-recharge-cx0ki",
  storageBucket: "easy-recharge-cx0ki.firebasestorage.app", // Corrected from firebasestorage.app to .appspot.com if that was a typo, but using provided value.
  messagingSenderId: "474217949052",
  appId: "1:474217949052:web:541c612404aa398df3e6f9",
  measurementId: "G-Q4L016LJWL"
};


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

let authInstance: ReturnType<typeof getAuth>;
let dbInstance: ReturnType<typeof getFirestore>;
let analyticsInstance: Analytics | null = null; // Initialize as null

try {
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined') {
    analyticsInstance = getAnalytics(app);
  }
} catch (error) {
  console.error("Error initializing Firebase services:", error);
  // Avoid throwing error in dev to prevent app crash, rely on console error
}

// Export the instances, handling potential initialization errors gracefully
export const auth = authInstance!;
export const db = dbInstance!;
export const analytics = analyticsInstance; // Export analytics, can be null if on server

// Debug log to confirm initialization values
console.log("Firebase Initialized with config:", {
    apiKey: firebaseConfig.apiKey ? 'Exists' : 'MISSING!',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId,
});
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("AIzaSyD") === false) {
    console.warn(
        'Firebase API Key might be missing or a placeholder. ' +
        'Please ensure your Firebase configuration is correctly set up in src/lib/firebase.ts ' +
        'or through environment variables if you switch to that method.'
    );
}
