// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"; // Keep getApp
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import other Firebase services as needed, e.g., getStorage

// Your web app's Firebase configuration - Ensure this matches your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyDU6drUk09IvFY2jX30KBeFuSDV3O1L2k4", // This should ideally be from process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "easy-recharge-cx0ki.firebaseapp.com", // Ensure this matches your project
  projectId: "easy-recharge-cx0ki", // Correct and consistent project ID
  storageBucket: "easy-recharge-cx0ki.appspot.com", // Ensure this matches your project (or firebaseConfig.projectId + ".appspot.com")
  messagingSenderId: "474217949052",
  appId: "1:474217949052:web:541c612404aa398df3e6f9"
};

// Basic check for placeholder or missing API key
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("AIzaSy") === false) {
  // Log an error in development, but avoid throwing to prevent crashing the build/app
  // You should replace the hardcoded key with environment variables
  console.warn("Firebase API Key might be missing or invalid. Check your configuration.");
}

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use getApp() if already initialized
}

export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app); // Example for Storage

export default app; // Export the initialized app
