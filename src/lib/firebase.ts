// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"; // Keep getApp
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import other Firebase services as needed, e.g., getStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDU6drUk09IvFY2jX30KBeFuSDV3O1L2k4",
  authDomain: "easy-recharge-cx0ki.firebaseapp.com",
  projectId: "easy-recharge-cx0ki",
  storageBucket: "easy-recharge-cx0ki.firebasestorage.app",
  messagingSenderId: "474217949052",
  appId: "1:474217949052:web:541c612404aa398df3e6f9"
};

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
